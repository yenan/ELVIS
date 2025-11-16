const PRESETS = {
  "Identity": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "Laplacian": [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],
  "Sobel X": [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],
  "Sobel Y": [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ],
  "Sharpen": [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  "Box Blur": [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
  ],
};

function PresetSelector(props) {
  function handlePresetChange(event) {
    const presetName = event.target.value;
    const kernel = PRESETS[presetName];
    props.onKernelChange(kernel);
  }

  return (
    <div className="preset-selector">
      <div className="preset-list">
        {Object.keys(PRESETS).map((presetName) => (
          <button
            key={presetName}
            value={presetName}
            onClick={handlePresetChange}
            className="preset-button"
          >
            {presetName}
          </button>
        ))
      }
    </div>
  </div>
  );
}

export default PresetSelector;
