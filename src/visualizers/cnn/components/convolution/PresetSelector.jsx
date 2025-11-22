import { useState } from "react";
import Button from "../../../../components/Button/Button.jsx";
import "./PresetSelector.css";

const PRESETS = {
  "Laplacian": [
    [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
  ],
  "Red": [
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  ],
  "Green": [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  ],
  "Blue": [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  ],
};

function PresetSelector(props) {
  const presetNames = Object.keys(PRESETS);

  const [selectedPreset, setSelectedPreset] = useState(presetNames[0]);

  function applyPreset() {
    props.onKernelChange(PRESETS[selectedPreset]);
  }

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
