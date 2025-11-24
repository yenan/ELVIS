import Tabs from "../utils/Tabs.jsx";
import Button from "../../../../components/Button/Button.jsx";

function Sidebar() {
  const tabData = [
    {
      label: "Train",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button>
            Start Training
          </Button>
          <Button>
            Stop Training
          </Button>
          <Button>
            Reset Training
          </Button>
        </div>
      ),
    },
    {
      label: "Dataset",
      content: (
        <div>
          Dataset: 
          <select value="MNIST">
            <option value="MNIST">MNIST</option>
            <option value="CIFAR-10">CIFAR-10</option>
          </select>
        </div>
      ),
    },
    {
      label: "Architecture",
      content: <div>Architecture Configuration</div>,
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
