import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { MnistData } from "./mnist.js";
import LossPlot from "./LossPlot.jsx";
import AccPlot from "./AccPlot.jsx";
import Tabs from "../Tabs.jsx";
import ActivationViewer from "./ActivationViewer.jsx";
import "./MnistTrainer.css";

export default function MnistTrainer() {
  const [data, setData] = useState(null);
  const [model, setModel] = useState(null);

	const [activationModel, setActivationModel] = useState(null);
	const [activations, setActivations] = useState(null);
	const [sampleTensor, setSampleTensor] = useState(null);
	const [sampleImage, setSampleImage] = useState(null);

  const [epochs, setEpochs] = useState([]);
  const [loss, setLoss] = useState([]);
  const [valLoss, setValLoss] = useState([]);
  const [acc, setAcc] = useState([]);
  const [valAcc, setValAcc] = useState([]);

  const [status, setStatus] = useState("Loading MNIST…");

  const tabData = [
    {
      label: "Curves",
      content: (
        <div className="plots">
          <LossPlot epochs={epochs} loss={loss} valLoss={valLoss} />
          <AccPlot epochs={epochs} acc={acc} valAcc={valAcc} />
        </div>
      ),
    },
    {
      label: "Activations",
      content: (
        <ActivationViewer 
          activations={activations} 
          sampleImage={sampleImage}
          onSampleChange={handleSampleChange}
        />
      ),
    },
  ];

  function handleSampleChange() {
    if (!data) {
      return;
    }
    const sample = data.nextTestBatch(1);
    const sampleImg = sample.xs.reshape([1, 28, 28, 1]);
    setSampleTensor(sampleImg);
    tensorToImageUrl(sampleImg).then((url) => {
      setSampleImage(url);
    });
  }

	async function load() {
		const d = new MnistData();
		await d.load();
		setData(d);

		const m = createModel();
		setModel(m);
		const aModel = createActivationModel(m);
		setActivationModel(aModel);

		const sample = d.nextTestBatch(1);
		const sampleImg = sample.xs.reshape([1, 28, 28, 1]);
		setSampleTensor(sampleImg);
		tensorToImageUrl(sampleImg).then((url) => {
			setSampleImage(url);
		});

		setStatus("Ready");
	}

  useEffect(() => {
    load();
  }, []);

  function createModel() {
    const model = tf.sequential();

    model.add(
      tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      })
    );

    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

    model.add(
      tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      })
    );

    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }

	function createActivationModel(model) {
		const layerOutputs = model.layers
		  .filter((layer) => layer.name.includes("conv"))
			.map((layer) => layer.output);
		return tf.model({ inputs: model.input, outputs: layerOutputs });
	}

	async function tensorToImageUrl(tensor) {
		// tensor must be shape [1, 28, 28, 1] or [28, 28]
		const squeezed = tensor.squeeze(); 
	
		const canvas = document.createElement("canvas");
		canvas.width = squeezed.shape[0];
		canvas.height = squeezed.shape[1];
	
		await tf.browser.toPixels(squeezed, canvas);
	
		return canvas.toDataURL(); 
	}


  async function handleTrain() {
    if (!model || !data) {
			return;
		}

    setStatus("Preparing training data…");

    const TRAIN_SIZE = 5000;
    const TEST_SIZE = 1000;

    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(TRAIN_SIZE);
      return [
        d.xs.reshape([TRAIN_SIZE, 28, 28, 1]),
        d.labels,
      ];
    });

    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(TEST_SIZE);
      return [
        d.xs.reshape([TEST_SIZE, 28, 28, 1]),
        d.labels,
      ];
    });

    setStatus("Training…");

    setEpochs([]);
    setLoss([]);
    setValLoss([]);
    setAcc([]);
    setValAcc([]);

    await model.fit(trainXs, trainYs, {
      epochs: 100,
      validationData: [testXs, testYs],
      batchSize: 32,

      callbacks: {
        onBatchEnd: async (batch, logs) => {
          setStatus(
            `Training: epoch ${logs.epoch + 1} batch ${batch + 1}`
          );

					if (activationModel && sampleTensor) {
						const acts = activationModel.predict(sampleTensor);

						const allMaps = await Promise.all(
							acts.map(async (act) => {
								const [b, h, w, c] = act.shape;
								const maps = [];
								const slice = act.squeeze();

								for (let i = 0; i < c; ++i) {
									const channel = slice
										.slice([0, 0, i], [h, w, 1])
										.reshape([h, w]);

									const min = channel.min();
									const max = channel.max();
									const range = max.sub(min);

									let norm = channel.sub(min);
									if (range.dataSync()[0] !== 0) {
										norm = norm.div(range);
									}

									const canvas = document.createElement("canvas");
									canvas.width = w;
									canvas.height = h;
									await tf.browser.toPixels(norm, canvas);
									maps.push(canvas.toDataURL());
								}
								return maps;
							})
						);

						setActivations(allMaps);
					}
  
          await tf.nextFrame();
        },

        onEpochEnd: async (epoch, logs) => {
          setEpochs((e) => [...e, epoch + 1]);
          setLoss((l) => [...l, logs.loss]);
          setValLoss((l) => [...l, logs.val_loss]);
          setAcc((a) => [...a, logs.acc]);
          setValAcc((a) => [...a, logs.val_acc]);
        },

        onTrainEnd: () => {
        	setStatus("Training complete");
        },
      },
    });

    trainXs.dispose();
    trainYs.dispose();
    testXs.dispose();
    testYs.dispose();
  }

	async function resetModel() {
		setStatus("Resetting...");

		await stopModel();

		setEpochs([]);
		setLoss([]);
		setValLoss([]);
		setAcc([]);
		setValAcc([]);
		setActivations(null);

		await load();
	}

	async function stopModel() {
		setStatus("Stopping...");

		if (model) {
			model.stopTraining = true;
		}

		await new Promise((resolve) => setTimeout(resolve, 50));
		
		setModel(null);
		setActivationModel(null);
	}

  return (
    <div className="mnist-trainer">
			<div className="progress-section">
        <Tabs tabs={tabData} defaultTab="Curves" />
			</div>

			<div className="sidebar">
				<p>Status: {status}</p>
				<button
					onClick={handleTrain}
					disabled={status === "Loading MNIST…"}
				>
					Train Model
				</button>
				<button
					onClick={resetModel}
					disabled={status === "Loading MNIST…"}
				>
					Reset Model
				</button>
			</div>
    </div>
  );
}

