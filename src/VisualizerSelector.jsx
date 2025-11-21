import { Link } from "react-router-dom";
import "./VisualizerSelector.css";


function VisualizerSelector() {
  return (
    <>
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
              src="images/decision_boundary.svg" 
              alt="Decision Boundary Image"
            />
          </div>
        </a>
        <div className="cell">
          Regularization
        </div>
        <div className="cell">
          Optimization Trajectory
        </div>
        <div className="cell">
          Gaussian Processes
        </div>
        <div className="cell">
          MLP
        </div>
        <Link to="/cnn">
          <div className="cell">
            CNN
          </div>
        </Link>
      </div>
    </>
  );
}

export default VisualizerSelector;

