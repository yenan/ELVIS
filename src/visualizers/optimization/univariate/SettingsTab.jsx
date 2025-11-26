import FunctionInput from "./FunctionInput.jsx";
import DerivativesDisplay from "./DerivativesDisplay.jsx";
import OptimizerSettings from "./OptimizerSettings.jsx";
import "../styles.css";

function SettingsTab(props) {
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
      <OptimizerSettings 
        optimizer={props.optimizer} 
        setOptimizer={props.setOptimizer}
        params={props.optimizerParams} 
        setParams={props.setOptimizerParams}
      />
    </div>
  );
}

export default SettingsTab;
