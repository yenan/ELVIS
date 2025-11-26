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
    </div>
  );
}

export default FunctionTab;
