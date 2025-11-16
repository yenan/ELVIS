import { useState } from 'react';
import './KernelEditor.css';

function KernelEditor(props) {
  const [width, setWidth] = useState(props.kernel[0].length);
  const [height, setHeight] = useState(props.kernel.length);

  function handleChange(row, col, value) {
    const newKernel = props.kernel.map((r) => [...r]);
    newKernel[row][col] = value === "" ? "" : parseFloat(value);
    props.onKernelChange?.(newKernel);
  }

  function handleSizeSubmit(event) {
    event.preventDefault();
    handleSizeChange(width, height);
  }

  function handleSizeChange(newWidth, newHeight) {
    const currentWidth = props.kernel[0].length;
    const currentHeight = props.kernel.length;
    const newKernel = [];

    for (let i = 0; i < newHeight; i++) {
      const row = [];
      for (let j = 0; j < newWidth; j++) {
        if (i < currentHeight && j < currentWidth) {
          row.push(props.kernel[i][j]);
        } else {
          row.push(0);
        }
      }
      newKernel.push(row);
    }

    props.onKernelChange?.(newKernel);
  }

  return (
    <div className="kernel-editor">
      <div className="kernel-size-options">
        <form onSubmit={handleSizeSubmit}>
          Width: {" "} 
          <input
            type="number"
            value={width}
            min={1}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
          Height: {" "}
          <input
            type="number"
            value={height}
            min={1}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
          <button type="submit">Resize</button>
        </form>
      </div>
      {props.kernel.map((row, i) => (
        <div key={i} className="kernel-row">
          {row.map((value, j) => (
            <input
              key={j}
              type="number"
              value={value}
              onChange={(e) => handleChange(i, j, e.target.value)}
              className="kernel-cell"
            />
          ))}
        </div>
      ))}
    <div className="bounding-box-button-container">
        <button onClick={props.onBoundingBoxButton}>
          Apply bounding box
        </button>
      </div>
    </div>
  );
}

export default KernelEditor;
