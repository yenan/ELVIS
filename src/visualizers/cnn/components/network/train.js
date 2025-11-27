import * as tf from '@tensorflow/tfjs';
import { MnistData } from '../../data/mnist.js';

async function load(dataset) {
	let data;
	if (dataset === "mnist") {
  	data = new MnistData();
	} else {
		throw new Error(`Dataset ${dataset} not supported`);
	}
  await data.load();
	return data;
}

class Cnn {
  constructor(architecture, inChannels) {
    this.architecture = architecture;
    this.inChannels = inChannels;
    this.weights = this.initWeights();
  }

  initWeights() {
    let weights = [];
    let inChannels = this.inChannels;

    for (const layer of this.architecture) {
      if (layer.type === 'conv2d') {
        const shape = [layer.kernel, layer.kernel, inChannels, layer.filters];
        const layerWeights = tf.variable(
          tf.randomUniform(
            shape, 
            -Math.sqrt(1 / (layer.kernel * layer.kernel * inChannels)), 
            Math.sqrt(1 / (layer.kernel * layer.kernel * inChannels))
          )
        );

        weights.push(layerWeights);
        layer.weights = layerWeights;
        inChannels = layer.filters;

      } else if (layer.type === 'dense') {
        // determined when flatten layer is reached
        layer.weights = null;
        layer.biases = null;
      }
    }
    return weights;
  }

  dispose() {
    for (const layer of this.architecture) {
      if (layer.type === 'conv2d') {
        layer.weights.dispose();
      } else if (layer.type === 'dense') {
        if (layer.weights) layer.weights.dispose();
        if (layer.biases) layer.biases.dispose();
      }
    }
  }

  forward(x) {
    let out = x;

    for (const layer of this.architecture) {
      switch (layer.type) {
        case "conv2d":
          out = out.conv2d(layer.weights, layer.stride, layer.padding);
					if (layer.activationType === "relu") {
						out = out.relu();
					}
          break;
        case "maxpool":
          out = out.maxPool([layer.size, layer.size], [layer.stride, layer.stride], 0);
          break;
        case "flatten":
          const flatDim = out.shape[1] * out.shape[2] * out.shape[3];
          out = out.reshape([-1, flatDim]);

          // initialize dense layer weights and biases
          const next = this.architecture[this.architecture.indexOf(layer) + 1];
          if (next?.type === "dense" && next.weights === null) {
            next.weights = tf.variable(
              tf.randomUniform(
                [flatDim, next.units], 
                -Math.sqrt(1 / flatDim), 
                Math.sqrt(1 / flatDim)
              )
            );
            next.biases = tf.variable(tf.zeros([next.units]));
          }
          break;

        case "dense":
          out = out.matMul(layer.weights).add(layer.biases);
          break;
      }
    }
    return out;
	}

	forwardWithInfo(x) {
		let out = x;
		const info = [];

		const inputShape = x.shape;
		info.push({
			type: "input",
			output: out.dataSync(),
			shape: inputShape
		});

		for (const layer of this.architecture) {
			switch (layer.type) {

				case "conv2d":
					out = out.conv2d(layer.weights, layer.stride, layer.padding);
					if (layer.activationType === "relu") {
						out = out.relu();
					}

					info.push({
						type: "conv2d",
						output: out.dataSync(),
						kernels: layer.weights.dataSync(),
						outputShape: out.shape,
						kernelShape: layer.weights.shape,
						stride: layer.stride,
						padding: layer.padding,
            activationType: layer.activationType
					});
					break;

				case "maxpool":
					out = out.maxPool([layer.size, layer.size], [layer.stride, layer.stride], 0);

					info.push({
						type: "maxpool",
						output: out.dataSync(),
						shape: out.shape,
						size: layer.size,
						stride: layer.stride
					});
					break;

				case "flatten":
					const flatDim = out.shape[1] * out.shape[2] * out.shape[3];
					out = out.reshape([-1, flatDim]);

					info.push({
						type: "flatten",
						output: out.dataSync(),
						shape: out.shape
					});

					// dense init
					const next = this.architecture[this.architecture.indexOf(layer) + 1];
					if (next?.type === "dense" && next.weights === null) {
						next.weights = tf.variable(
							tf.randomUniform(
								[flatDim, next.units],
								-Math.sqrt(1 / flatDim),
								Math.sqrt(1 / flatDim)
							)
						);
						next.biases = tf.variable(tf.zeros([next.units]));
					}
					break;

				case "dense":
					out = out.matMul(layer.weights).add(layer.biases);

					info.push({
						type: "dense",
						output: out.dataSync(),
						weights: layer.weights.dataSync(),
						biases: layer.biases.dataSync(),
						outputShape: out.shape,
						weightShape: layer.weights.shape,
						biasShape: layer.biases.shape,
						units: layer.units
					});
					break;
			}
		}

		return { output: out, info: info };
	}

}

async function train(
	data, 
	model, 
	optimizer, 
	batchSize, 
	epochs,
	controller,
	onBatchEnd = null
) {
	const numBatches = Math.floor(data.trainSize / batchSize);
	for (let epoch = 0; epoch < epochs; ++epoch) {
		for (let b = 0; b < numBatches; ++b) {

			if (controller.stopRequested) {
				console.log("Training stopped");
				return;
			}

			while (controller.isPaused) {
				await tf.nextFrame();
			}

			const cost = optimizer.minimize(() => {
				const batch = data.nextTrainBatch(batchSize);
				const xs = batch.xs.reshape(
					[
						batchSize, 
						data.imageSize, 
						data.imageSize, 
						data.numInputChannels
					]
				);
				const preds = model.forward(xs);
				const lossValue = tf.losses.softmaxCrossEntropy(
					batch.labels, preds
				).mean();
				return lossValue;
			}, true);

			const lossVal = (await cost.data())[0];

			const sample = data.getTestSample(controller.sampleIndex);

			const { output, info } = model.forwardWithInfo(
				sample.xs.reshape(
					[
						1, 
						data.imageSize, 
						data.imageSize, 
						data.numInputChannels
					]
				)
			);

      // Add output layer info
      const probs = tf.tidy(() => {
				return tf.softmax(output);
			});
			const shape = probs.shape;
      info.push({
        type: "output",
        output: probs.dataSync(),
				shape: shape
      });

			if (controller.stopRequested) {
				console.log("Training stopped");
				return;
			}

			if (onBatchEnd) {
				onBatchEnd(epoch, b, lossVal, info);
			}

			await tf.nextFrame();
		}
	}
	console.log("Training complete");
}


export { load, train, Cnn };
