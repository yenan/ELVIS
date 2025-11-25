import * as tf from '@tensorflow/tfjs';
import { useState, useEffect, useRef } from 'react';
import NetworkViewer from "./NetworkViewer.jsx";
import Sidebar from "./Sidebar.jsx";
import { load, train, Cnn } from "./train.js";
import './NetworkVisualizer.css';

const DEFAULT_ARCHITECTURE = [
  { type: "conv2d", filters: 8, kernel: 5, stride: 1, padding: 1 },
  { type: "relu" },
  { type: "maxpool", size: 2, stride: 2 },

  { type: "conv2d", filters: 16, kernel: 5, stride: 1, padding: 1 },
  { type: "relu" },
  { type: "maxpool", size: 2, stride: 2 },

  { type: "flatten" },
  { type: "dense", units: 10 },
];

function NetworkVisualizer() {
  // dataset states
  const [dataset, setDataset] = useState("mnist");
  const [imageSize, setImageSize] = useState(28);
  const [numClasses, setNumClasses] = useState(10);
	const [data, setData] = useState(null);

  // optimization states
  const [learningRate, setLearningRate] = useState(0.01);
	const [batchSize, setBatchSize] = useState(64);
	const [epochs, setEpochs] = useState(5);
	const [optimizer, setOptimizer] = useState(null);
  
  // architecture states
  const [architecture, setArchitecture] = useState(DEFAULT_ARCHITECTURE);

  // training states
  const [model, setModel] = useState(null);
	const [losses, setLosses] = useState([]);
	const [isTraining, setIsTraining] = useState(false);
	const trainController = useRef({
		isPaused: false,
		stopRequested: false,
	});

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
	}, [architecture, data, learningRate]);

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
		resetModel();
	}

	function resetModel() {
		if (!data) {
			return;
		}

		const inChannels = data.numInputChannels;
		const cnn = new Cnn(architecture, inChannels);
		setModel(cnn);
		const opt = tf.train.adam(learningRate);
		setOptimizer(opt);
	}

	async function startTraining() {
		if (!model || !data || !optimizer || isTraining) {
			return;
		}

		setIsTraining(true);
		trainController.current.isPaused = false;
		trainController.current.stopRequested = false;

		try {
			await train(
				data,
				model,
				optimizer,
				batchSize,
				epochs,
				trainController.current,
				({ epoch, batch, loss }) => {
					setLosses((prevLosses) => [
						...prevLosses,
						{ epoch, batch, loss }
					]);
				}
			);
		} finally {
			setIsTraining(false);
			trainController.current.isPaused = false;
			trainController.current.stopRequested = false;
		}
	}

  return (
    <div className="network-visualizer">
      <NetworkViewer losses={losses} isTraining={isTraining} />
      <Sidebar 
				onStartTraining={handleStartTraining} 
				onPauseTraining={handlePauseTraining}
				onContinueTraining={handleContinueTraining}
				onStopTraining={handleStopTraining}
				onResetTraining={handleResetTraining}
				isTraining={isTraining}
			/>
    </div>
  );
}

export default NetworkVisualizer;
