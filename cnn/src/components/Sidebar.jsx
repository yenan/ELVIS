import KernelEditor from "./KernelEditor.jsx";
import PresetSelector from "./PresetSelector.jsx";
import Tabs from "./Tabs.jsx";
import "./Sidebar.css";


const DEFAULT_TAB = "Input";

function Sidebar(props) {
  const tabData = [
    {
      label: "Input",
      content: (
        <form>
          <input 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          /> 
        </form>
      ),
    },
    {
      label: "Kernel",
      content: (
        <KernelEditor 
          kernel={props.kernel} 
          onKernelChange={props.onKernelChange} 
          onBoundingBoxButton={props.onBoundingBoxButton}
        />
      ),
    },
    {
      label: "Presets",
      content: <PresetSelector onKernelChange={props.onKernelChange} />,
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
