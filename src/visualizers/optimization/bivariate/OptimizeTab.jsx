import Button from "../../../components/Button/Button.jsx";
import "../styles.css";

function OptimizeTab(props) {
  return (
    <div className="card">
      <div className="field">
        <label>Current Step Count</label>
        <input
          type="number"
          value={props.stepCount}
          readOnly
        />
      </div>
      <div className="field">
        <label>Current f(x, y)</label>
        <input
          type="text"
          value={props.currentZ?.toPrecision(8)}
          readOnly
        />
      </div>
      <div className="field">
        <label>Current Gradient Norm</label>
        <input
          type="text"
          value={props.currentGradNorm?.toPrecision(8)}
          readOnly
        />
      </div>
      <Button 
        onClick={() => props.setStepCount(props.stepCount + 1)}
        className="optimize-button"
      >
        Next Step
      </Button>
      <Button
        onClick={
          () => props.setStepCount(props.stepCount > 0 ? props.stepCount - 1 : 0)
        }
        className="optimize-button"
      >
        Previous Step
      </Button>
      <Button
        onClick={() => props.setStepCount(0)}
        className="optimize-button"
      >
        Reset
      </Button>
    </div>
  );
}

export default OptimizeTab;
