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
          functionInput={props.functionInput} 
          setFunctionInput={props.setFunctionInput}
          gradient={props.gradient}
          hessian={props.hessian}

          xMin={props.functionXMin}
          setXMin={props.setFunctionXMin}
          xMax={props.functionXMax}
          setXMax={props.setFunctionXMax}
          yMin={props.functionYMin}
          setYMin={props.setFunctionYMin}
          yMax={props.functionYMax}
          setYMax={props.setFunctionYMax}
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
          xMin={props.functionXMin}
          xMax={props.functionXMax}
          yMin={props.functionYMin}
          yMax={props.functionYMax}
        />
      ),
    },
    {
      label: "Optimize",
      content: (
        <OptimizeTab 
          stepCount={props.stepCount}
          setStepCount={props.setStepCount}
          currentZ={props.currentZ}
          currentGradNorm={props.currentGradNorm}
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
