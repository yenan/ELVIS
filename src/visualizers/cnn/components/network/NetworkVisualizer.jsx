import * as tf from '@tensorflow/tfjs';
import { useState, useEffect, useRef } from 'react';
import NetworkViewer from "./NetworkViewer.jsx";
import Sidebar from "./Sidebar.jsx";
import { load, train, Cnn } from "./train.js";
import './NetworkVisualizer.css';

// const DEFAULT_ARCHITECTURE = [
//   { type: "conv2d", filters: 8, kernel: 5, stride: 1, padding: 1, activationType: "relu" },
//   { type: "maxpool", size: 2, stride: 2 },
//
//   { type: "conv2d", filters: 16, kernel: 5, stride: 1, padding: 1 , activationType: "relu"},
//   { type: "maxpool", size: 2, stride: 2 },
//
//   { type: "flatten" },
//   { type: "dense", units: 10, activationType: "softmax" },
// ];

const DEFAULT_ARCHITECTURE = (
`[conv2d filters=8 kernel=5 
stride=1 padding=1 activation=relu]

[maxpool size=2 stride=2]

[conv2d filters=16 kernel=5 
stride=1 padding=1 activation=relu]

[maxpool size=2 stride=2]

[flatten]

[dense units=10 activation=softmax]`
);


function parseValue(raw) {
  // Try to parse as number; if NaN, keep as string
  if (raw.trim() === "") {
    return raw;
  }

  const num = Number(raw);
  if (!Number.isNaN(num)) {
    return num;
  }

  return raw;
}

function parseArchitecture(text) {
  const layers = [];

  // Match anything inside [ ... ]
  const matches = text.match(/\[(.*?)\]/gs);
  if (!matches) return layers;

  for (const block of matches) {
    // Remove the brackets and trim
    const content = block.slice(1, -1).trim();
    if (content.length === 0) continue;

    const tokens = content.split(/\s+/);
    if (tokens.length === 0) continue;

    const type = tokens[0];
    const layer = { type };

    for (let i = 1; i < tokens.length; ++i) {
      const token = tokens[i];
      const [rawKey, rawValue] = token.split("=", 2);

      if (!rawKey || rawValue === undefined) continue;

      let key = rawKey;
      let value = parseValue(rawValue);

      if (key === "activation") {
        key = "activationType";
      }

      layer[key] = value;
    }

    layers.push(layer);
  }

  return layers;
}

function NetworkVisualizer() {
  // dataset states
  const [dataset, setDataset] = useState("mnist");
  const [imageSize, setImageSize] = useState(28);
  const [numClasses, setNumClasses] = useState(10);
	const [data, setData] = useState(null);

  // optimization states
	const [optimizerType, setOptimizerType] = useState("adam");
  const [optimizerParams, setOptimizerParams] = useState(
    {
      learningRate: "0.001",
      beta1: "0.9",
      beta2: "0.999",
      epsilon: "1e-8",
      batchSize: "32",
      epochs: "5",
    }
  );
  
  // architecture states
  const [architecture, setArchitecture] = useState(DEFAULT_ARCHITECTURE);

  // training states
	const [losses, setLosses] = useState([]);
	const [isTraining, setIsTraining] = useState(false);
	const trainController = useRef({
		isPaused: false,
		stopRequested: false,
		sampleIndex: 0,
	});
  const modelRef = useRef(null);
  const optimizerRef = useRef(null);

	// training visualization
	const [info, setInfo] = useState(null);

	// init dataset
	useEffect(() => {
		async function loadData() {
			const d = await load(dataset);
			setData(d);
		}
		loadData();
	}, [dataset]);

	// init model
	useEffect(() => {
		resetModel();
    resetOptimizer();
	}, [architecture, data, optimizerType, optimizerParams]);

	function handleStartTraining() {
		console.log("Starting training...");
		// trainController updated in startTraining
		startTraining();
	}

	function handlePauseTraining() {
		console.log("Pausing training...");
		trainController.current.isPaused = true;
	}

	function handleContinueTraining() {
		console.log("Continuing training...");
		trainController.current.isPaused = false;
	}

	function handleStopTraining() {
		console.log("Stopping training...");
		trainController.current.stopRequested = true;
		trainController.current.isPaused = false;
	}

	async function waitUntilNotTraining() {
		return new Promise(resolve => {
			function check() {
				if (!isTraining) {
					resolve();
				} else {
					requestAnimationFrame(check);
				}
			}
			check();
		});
	}
	
	async function handleResetTraining() {
		console.log("Resetting training...");
		handleStopTraining();

		await waitUntilNotTraining();
		console.log("Training stopped. Resetting model.");
		setLosses([]);
		setInfo(null);
		resetModel();
    resetOptimizer();
	}

	function resetModel() {
		if (!data) {
			return;
		}

    if (modelRef.current) {
      modelRef.current.dispose();
    }

		const inChannels = data.numInputChannels;
		const cnn = new Cnn(parseArchitecture(architecture), inChannels);
    modelRef.current = cnn;
	}

  function resetOptimizer() {
    if (optimizerType === "adam") {
      const learningRate = parseFloat(optimizerParams.learningRate);
      const beta1 = parseFloat(optimizerParams.beta1);
      const beta2 = parseFloat(optimizerParams.beta2);
      const epsilon = parseFloat(optimizerParams.epsilon);

      if (Number.isNaN(learningRate) || learningRate <= 0) {
        alert("Invalid learning rate for Adam optimizer.");
        return;
      }
      if (Number.isNaN(beta1) || beta1 < 0) {
        alert("Invalid beta1 for Adam optimizer.");
        return;
      }
      if (Number.isNaN(beta2) || beta2 < 0) {
        alert("Invalid beta2 for Adam optimizer.");
        return;
      }
      if (Number.isNaN(epsilon) || epsilon <= 0) {
        alert("Invalid epsilon for Adam optimizer.");
        return;
      } 

      const opt = tf.train.adam(learningRate, beta1, beta2, epsilon);
      if (optimizerRef.current) {
        optimizerRef.current.dispose();
      }
      optimizerRef.current = opt;
    } else if (optimizerType === "sgd") {
      const learningRate = parseFloat(optimizerParams.learningRate);
      if (Number.isNaN(learningRate) || learningRate <= 0) {
        alert("Invalid learning rate for SGD optimizer.");
        return;
      }

      const opt = tf.train.sgd(learningRate);
      if (optimizerRef.current) {
        optimizerRef.current.dispose();
      }
      optimizerRef.current = opt;
    } else {
      alert(`Unsupported optimizer type: ${optimizerType}`);
    }
  }

	async function startTraining() {
		if (!modelRef || !data || !optimizerRef || isTraining) {
			return;
		}

		setIsTraining(true);
		trainController.current.isPaused = false;
		trainController.current.stopRequested = false;

    const batchSize = parseFloat(optimizerParams.batchSize);
    if (Number.isNaN(batchSize) || batchSize <= 0) {
      alert("Invalid batch size.");
      setIsTraining(false);
      return;
    }
    const epochs = parseFloat(optimizerParams.epochs);
    if (Number.isNaN(epochs) || epochs <= 0) {
      alert("Invalid number of epochs.");
      setIsTraining(false);
      return;
    }

		try {
			await train(
				data,
				modelRef.current,
				optimizerRef.current,
        batchSize,
        epochs,
				trainController.current,
				({ epoch, batch, loss, info }) => {
					setLosses((prevLosses) => [
						...prevLosses,
						{ epoch, batch, loss }
					]);
					setInfo(info);
				}
			);
		} finally {
			setIsTraining(false);
			trainController.current.isPaused = false;
			trainController.current.stopRequested = false;
			alert("Training finished.");
		}
	}

  function handleArchitectureChange(newArchitecture) {
    if (isTraining) {
      alert("Cannot change architecture while training is in progress.");
    } else {
      setArchitecture(newArchitecture);
    }
  }

  function handleOptimizerChange(newOptimizerType, newOptimizerParams) {
    if (isTraining) {
      alert("Cannot change optimizer settings while training is in progress.");
    } else {
      setOptimizerType(newOptimizerType);
      setOptimizerParams(newOptimizerParams);
    }
  }

  return (
    <div className="network-visualizer">
      <NetworkViewer 
				losses={losses} 
				info={info}
				isTraining={isTraining} 
			/>
      <Sidebar 
				onStartTraining={handleStartTraining} 
				onPauseTraining={handlePauseTraining}
				onContinueTraining={handleContinueTraining}
				onStopTraining={handleStopTraining}
				onResetTraining={handleResetTraining}
				isTraining={isTraining}
		    isPaused={trainController.current.isPaused}
		    architecture={architecture}
				onArchitectureChange={handleArchitectureChange}
        optimizerType={optimizerType}
        optimizerParams={optimizerParams}
        onOptimizerChange={handleOptimizerChange}
			/>
    </div>
  );
}

export default NetworkVisualizer;
