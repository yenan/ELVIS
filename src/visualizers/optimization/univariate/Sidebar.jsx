import OptimizeTab from "./OptimizeTab.jsx";
import SettingsTab from "./SettingsTab.jsx";
import Tabs from "../../../components/Tabs/Tabs.jsx";

function Sidebar(props) {
  const tabData = [
    {
      label: "Settings",
      content: (
        <SettingsTab 
          draftFunctionInput={props.draftFunctionInput} 
          setDraftFunctionInput={props.setDraftFunctionInput}
          derivative={props.derivative}
          secondDerivative={props.secondDerivative}
          showSecondDerivative={props.showSecondDerivative}

          optimizer={props.optimizer}
          setOptimizer={props.setOptimizer}
          optimizerParams={props.optimizerParams}
          setOptimizerParams={props.setOptimizerParams}
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
      <Tabs tabs={tabData} defaultTab="Settings"/>
    </div>
  );
}

export default Sidebar;
