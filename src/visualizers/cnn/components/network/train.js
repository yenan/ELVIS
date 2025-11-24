import { MnistData } from './data.js';

async function load() {
  data = new MnistData();
  await data.load();
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
            -sqrt(1 / (layer.kernel * layer.kernel * inChannels)), 
            sqrt(1 / (layer.kernel * layer.kernel * inChannels))
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

  forward(x) {
    let out = x;

    for (const layer of this.architecture) {
      switch (layer.type) {
        case "conv2d":
          out = out.conv2d(layer.weights, layer.stride, layer.padding);
          break;
        case "relu":
          out = out.relu();
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
                -sqrt(1 / flatDim), 
                sqrt(1 / flatDim)
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

