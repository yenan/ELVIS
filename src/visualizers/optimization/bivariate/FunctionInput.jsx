import { useEffect, useRef } from "react";
import "../styles.css";

const PRESETS = {
  "-- Custom --": {
    func: "x ^ 2 + 3 * y ^ 2",
    min: -1,
    max: 1,
  },
  "Ackley function": {
    func: "-20 * exp(-0.2 * sqrt(0.5 * (x^2 + y^2))) - exp(0.5 * (cos(2 * pi * x) + cos(2 * pi * y))) + e + 20",
    min: -5,
    max: 5,
  },
  "Rastrigin function": {
    func: "20 + (x^2 - 10 * cos(2 * pi * x)) + (y^2 - 10 * cos(2 * pi * y))",
    min: -5.12,
    max: 5.12,
  },
  "Rosenbrock function": {
    func: "(1 - x)^2 + 100 * (y - x^2)^2",
    min: -2,  // wikipedia says -inf to inf, not sure what to pick
    max: 2,
  },
  "Sphere function": {
    func: "x^2 + y^2",
    min: -1,
    max: 1,
  },
};


function getContentHeight(element) {
  const style = window.getComputedStyle(element);
  const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  return element.scrollHeight - padding;
}


function FunctionInput(props) {
  const currentPreset =
    Object.entries(PRESETS).find(([name, preset]) => preset.func === props.functionInput)?.[0]
    ?? "— Custom —";

  function handlePresetChange(e) {
    const selectedPreset = e.target.value;
    props.setFunctionInput(PRESETS[selectedPreset].func);
    props.setXMin(PRESETS[selectedPreset].min);
    props.setXMax(PRESETS[selectedPreset].max);
    props.setYMin(PRESETS[selectedPreset].min);
    props.setYMax(PRESETS[selectedPreset].max);
  }

  // auto-resize textarea based on functionInput size
  const functionInputRef = useRef(null);
  useEffect(() => {
    if (!functionInputRef.current) return;
    
    functionInputRef.current.style.height = "1.5em";
    functionInputRef.current.style.height = getContentHeight(functionInputRef.current) + "px";
  }, [props.functionInput]);

  return (
    <div className="field">
      <label htmlFor="function-input">Function (in terms of x and y)</label>
    
      <textarea
        id="function-input"
        ref={functionInputRef}
        type="text"
        value={props.functionInput}
        autoComplete="off"
        onChange={(e) => {
          // Remove newlines
          e.target.value = e.target.value.replace(/\n/g, "");
          props.setFunctionInput(e.target.value);
        }}
      />

      <div style={{ marginTop: "0.5em" }}>
        <label htmlFor="preset-select" style={{ marginRight: "0.5em" }}>
          Presets:
        </label>
        <select
          id="preset-select"
          value={currentPreset}
          onChange={handlePresetChange}
        >
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FunctionInput;
