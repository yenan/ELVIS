import FunctionInput from "./FunctionInput.jsx";
import DerivativesDisplay from "./DerivativesDisplay.jsx";
import "../styles.css";

function FunctionTab(props) {
  return (
    <div className="controls">
      <FunctionInput 
        draftFunctionInput={props.draftFunctionInput} 
        setDraftFunctionInput={props.setDraftFunctionInput}
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
          type="number"
          value={props.xMin}
          onChange={(e) => props.setXMin(parseFloat(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="x-max-input">X Max</label>
        <input
          id="x-max-input"
          type="number"
          value={props.xMax}
          onChange={(e) => props.setXMax(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

export default FunctionTab;
