import { useState } from "react";
import "./PresetSelector.css";

const PRESETS = {
  "Identity": [
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  ],
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
  "Box Blur": [
    [
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
    ],
    [
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
    ],
    [
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
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

      <button className="preset-apply" onClick={applyPreset}>
        Apply
      </button>
    </div>
  );
}

export default PresetSelector;
