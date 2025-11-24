import { useState } from 'react';
import NetworkViewer from "./NetworkViewer.jsx";
import Sidebar from "./Sidebar.jsx";
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
  const [dataset, setDataset] = useState('MNIST');
  const [imageSize, setImageSize] = useState(28);
  const [numClasses, setNumClasses] = useState(10);

  // optimization states
  const [learningRate, setLearningRate] = useState(0.1);
  
  // architecture states
  const [architecture, setArchitecture] = useState(DEFAULT_ARCHITECTURE);

  // training states
  const [model, setModel] = useState(null);

  return (
    <div className="network-visualizer">
      <NetworkViewer />
      <Sidebar />
    </div>
  );
}

export default NetworkVisualizer;
