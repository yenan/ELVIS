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
        derivative={props.derivative}
        secondDerivative={props.secondDerivative}
        showSecondDerivative={props.showSecondDerivative}
      />
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
  );
}

export default FunctionTab;
