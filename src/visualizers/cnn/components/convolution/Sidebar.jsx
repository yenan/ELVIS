import KernelEditor from "./KernelEditor.jsx";
import Tabs from "../utils/Tabs.jsx";
import InputSelector from "./InputSelector.jsx";
import "./Sidebar.css";


const DEFAULT_TAB = "Input";

function Sidebar(props) {
  const tabData = [
    {
      label: "Input",
      content: (
        <InputSelector 
          handleFileChange={handleFileChange}
          useColor={props.useColor}
          onUseColor={props.onUseColor}
        />
      ),
    },
    {
      label: "Kernel",
      content: (
        <KernelEditor 
          kernel={props.kernel} 
          onKernelChange={props.onKernelChange} 
          onBoundingBoxButton={props.onBoundingBoxButton}
          useColor={props.useColor}
        />
      ),
    },
  ];

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      props.onUpload(file);
    }
  }

  return (
    <div className="sidebar">
      <Tabs 
        tabs={tabData} 
        defaultTab={DEFAULT_TAB} 
      />
    </div>
  );
}

export default Sidebar;
