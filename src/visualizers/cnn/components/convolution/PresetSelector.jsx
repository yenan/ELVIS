import { useState, useEffect } from "react";
import Button from "../../../../components/Button/Button.jsx";
import { PRESETS_COLOR, PRESETS_GRAY } from "../../data/convolution_presets.js";
import "./PresetSelector.css";

function PresetSelector(props) {
  const [presetNames, setPresetNames] = useState(
    props.useColor
      ? Object.keys(PRESETS_COLOR)
      : Object.keys(PRESETS_GRAY)
  );
  const [selectedPreset, setSelectedPreset] = useState(presetNames[0]);

  function applyPreset() {
    if (props.useColor) {
      props.onKernelChange(PRESETS_COLOR[selectedPreset]);
    } else {
      props.onKernelChange(PRESETS_GRAY[selectedPreset]);
    }
  }

  useEffect(() => {
    console.log("PresetSelector: useEffect triggered");
    console.log("useColor:", props.useColor);
    const names = props.useColor
      ? Object.keys(PRESETS_COLOR)
      : Object.keys(PRESETS_GRAY);
    setPresetNames(names);
    setSelectedPreset(names[0]);
  }, [props.useColor]);

  return (
    <div className="preset-selector">
      <label className="preset-label">Preset:</label>

      <select
        className="preset-dropdown"
        value={selectedPreset}
        onChange={(e) => setSelectedPreset(e.target.value)}
      >
        {presetNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <Button onClick={applyPreset}>
        Apply
      </Button>
    </div>
  );
}

export default PresetSelector;
