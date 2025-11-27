import Tabs from "../../../../components/Tabs/Tabs.jsx";
import Button from "../../../../components/Button/Button.jsx";
import ArchitectureEditor from "./ArchitectureEditor.jsx";

function Sidebar(props) {
  const tabData = [
    {
      label: "Train",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					{ !props.isTraining && (
							<>
								<Button onClick={props.onStartTraining}>
									Start Training
								</Button>
								<Button onClick={props.onResetTraining}>
									Reset Training
								</Button>
							</>
						)
					}
					{ props.isTraining && (
							<>
								<Button onClick={props.onPauseTraining}>
									Pause Training
								</Button>
								<Button onClick={props.onContinueTraining}>
									Continue Training
								</Button>
								<Button onClick={props.onStopTraining}>
									Stop Training
								</Button>
							</>
						)
					}
        </div>
      ),
    },
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
      label: "Optimization",
      content: <div>Optimization Parameters</div>,
    },
  ];

  return (
    <div className="sidebar">
      <Tabs
        defaultTab="Train"
        tabs={tabData}
      />
    </div>
  );
}

export default Sidebar;
