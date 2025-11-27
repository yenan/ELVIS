import FunctionInput from "./FunctionInput.jsx";
import DerivativesDisplay from "./DerivativesDisplay.jsx";
import "../styles.css";

function FunctionTab(props) {
  return (
    <div className="controls">
      <FunctionInput 
        functionInput={props.functionInput} 
        setFunctionInput={props.setFunctionInput}
      />
      <DerivativesDisplay
        gradient={props.gradient}
        hessian={props.hessian}
      />
      <div className="double-field">
        <div className="field">
          <label htmlFor="x-min-input">X Min</label>
          <input
            id="x-min-input"
            type="text"
            value={props.xMin}
            onChange={(e) => props.setXMin(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="x-max-input">X Max</label>
          <input
            id="x-max-input"
            type="text"
            value={props.xMax}
            onChange={(e) => props.setXMax(e.target.value)}
          />
        </div>
      </div>
      <div className="double-field">
        <div className="field">
          <label htmlFor="y-min-input">Y Min</label>
          <input
            id="y-min-input"
            type="text"
            value={props.yMin}
            onChange={(e) => props.setYMin(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="y-max-input">Y Max</label>
          <input
            id="y-max-input"
            type="text"
            value={props.yMax}
            onChange={(e) => props.setYMax(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default FunctionTab;
