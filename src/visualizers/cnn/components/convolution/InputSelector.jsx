import { useRef } from "react";
import Switch from "../../../../components/Switch/Switch.jsx";
import Button from "../../../../components/Button/Button.jsx";
import "./InputSelector.css";

function InputSelector(props) {
  const fileInputRef = useRef(null);

  return (
    <div className="input-selector">
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={props.handleFileChange}
        style={{ display: "none" }}
      /> 
      <Button onClick={() => fileInputRef.current.click()}>
        Upload Image
      </Button>
      <Switch
        checked={props.useColor}
        onChange={(e) => props.onUseColor(e)}
        leftLabel="Grayscale"
        rightLabel="Color"
      />
    </div>
  );
}

export default InputSelector;
