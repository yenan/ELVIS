import Tabs from "../../../../components/Tabs/Tabs.jsx";
import Button from "../../../../components/Button/Button.jsx";
import ArchitectureEditor from "./ArchitectureEditor.jsx";
import OptimizerSettings from "./OptimizerSettings.jsx";

function Sidebar(props) {
  const tabData = [
    {
      label: "Dataset",
      content: (
        <div>
          Dataset: 
          <select value="mnist">
            <option value="mnist">MNIST</option>
            <option value="cifar-10">CIFAR-10</option>
          </select>
        </div>
      ),
    },
    {
      label: "Architecture",
      content: (
				<ArchitectureEditor 
					architecture={props.architecture}
					onChange={props.onArchitectureChange}
				/>
			),
    },
    {
      label: "Optimize",
      content: (
				<>
					<OptimizerSettings 
						optimizer={props.optimizerType}
						params={props.optimizerParams}
						onOptimizerChange={props.onOptimizerChange}
						onStartTraining={props.onStartTraining}
				    onResetTraining={props.onResetTraining}
				    onPauseTraining={props.onPauseTraining}
				    onContinueTraining={props.onContinueTraining}
				    onStopTraining={props.onStopTraining}
				    isTraining={props.isTraining}
					/>
				</>
      ),
    },
  ];

  return (
    <div className="sidebar">
      <Tabs
        defaultTab="Dataset"
        tabs={tabData}
      />
    </div>
  );
}

export default Sidebar;
