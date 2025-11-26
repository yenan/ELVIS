import { Link } from "react-router-dom";
import "./VisualizerSelector.css";
import decisionBoundaryImage from "./assets/decision_boundary.svg";
import regularizationImage from "./assets/regularization.png";
import gaussianProcessesImage from "./assets/gaussian_processes.png";
import mlpImage from "./assets/mlp.png";


function VisualizerSelector() {
  return (
    <div className="visualizer-selector">
      <h1 className="title">
        ELVIS
      </h1>
      <h3 className="subtitle">
        Interactive ML Visualisations
      </h3>
      <div className="grid">
        <a href="https://huggingface.co/spaces/elvis-hf/interactive_decision_boundary">
          <div className="cell">
            Decision Boundary
            <img 
              src={decisionBoundaryImage}
              alt="Decision Boundary Image"
            />
          </div>
        </a>
        <a href="https://huggingface.co/spaces/elvis-hf/regularization">
          <div className="cell">
            Regularization
            <img
              src={regularizationImage}
              alt="Regularization Image"
            />
          </div>
        </a>
        <Link to="/optimization">
          <div className="cell">
            Optimization Trajectory
          </div>
        </Link>
        <a href="https://huggingface.co/spaces/elvis-hf/gp_visualizer">
          <div className="cell">
            Gaussian Processes
            <img
              src={gaussianProcessesImage}
              alt="Gaussian Processes Image"
            />
          </div>
        </a>
        <a href="https://huggingface.co/spaces/elvis-hf/mlp_visualizer">
          <div className="cell">
            MLP
            <img
              src={mlpImage}
              alt="MLP Image"
            />
          </div>
        </a>
        <Link to="/cnn">
          <div className="cell">
            CNN
          </div>
        </Link>
      </div>
    </div>
  );
}

export default VisualizerSelector;

