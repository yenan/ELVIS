import KernelEditor from "./KernelEditor.jsx";
import Tabs from "../utils/Tabs.jsx";
import "./Sidebar.css";


const DEFAULT_TAB = "Input";

function Sidebar(props) {
  const tabData = [
    {
      label: "Input",
      content: (
        <div>
          <form>
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            /> 
          </form>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={props.useColor} 
              onChange={(e) => props.onUseColor(e.target.checked)}
            />
            <span className="slider round"></span>
            <span className="label-text">Use Color</span>
          </label>
        </div>
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
