import OptimizeTab from "./OptimizeTab.jsx";
import FunctionTab from "./FunctionTab.jsx";
import OptimizerTab from "./OptimizerTab.jsx";
import Tabs from "../../../components/Tabs/Tabs.jsx";

function Sidebar(props) {
  const tabData = [
    {
      label: "Function",
      content: (
        <FunctionTab 
          draftFunctionInput={props.draftFunctionInput} 
          setDraftFunctionInput={props.setDraftFunctionInput}
          derivative={props.derivative}
          secondDerivative={props.secondDerivative}
          showSecondDerivative={props.showSecondDerivative}
        />
      ),
    },
    {
      label: "Optimizer",
      content: (
        <OptimizerTab
          optimizer={props.optimizer}
          setOptimizer={props.setOptimizer}
          params={props.optimizerParams}
          setParams={props.setOptimizerParams}
        />
      ),
    },
    {
      label: "Optimize",
      content: (
        <OptimizeTab 
          stepCount={props.stepCount}
          setStepCount={props.setStepCount}
        />
      ),
    },
  ];

  return (
    <div className="sidebar">
      <Tabs tabs={tabData} defaultTab="Function"/>
    </div>
  );
}

export default Sidebar;
