import { useState, useEffect } from 'react';
import PresetSelector from './PresetSelector.jsx';
import Button from "../../../../components/Button/Button.jsx";
import './KernelEditor.css';

function KernelEditor(props) {
  const [width, setWidth] = useState(props.kernel[0].length);
  const [height, setHeight] = useState(props.kernel.length);

  const [selectedChannel, setSelectedChannel] = useState(0);  // 0=R, 1=G, 2=B

  function handleChange(channel, row, col, value) {
    const newKernel = props.kernel.map((r) => [...r]);
    newKernel[channel][row][col] = value === "" ? "" : parseFloat(value);
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

  useEffect(() => {
    if (!props.useColor) {
      setSelectedChannel(0);
    }
  }, [props.useColor]);

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
          <Button type="submit">Resize</Button>
        </form>
      </div>
      {props.useColor && (
        <div className="channel-selector">
          <div className="channel-buttons">
            <Button 
                selected={selectedChannel === 0}
                onClick={() => setSelectedChannel(0)}
            >
              R
            </Button>
            <Button
                selected={selectedChannel === 1}
                onClick={() => setSelectedChannel(1)}
            >
              G
            </Button>
            <Button
                selected={selectedChannel === 2}
                onClick={() => setSelectedChannel(2)}
            >
              B
            </Button>
          </div>		
        </div>
      )}
      <div className="kernel-matrix">
				{props.kernel[selectedChannel].map((row, i) => (
					<div key={i} className="kernel-row">
						{row.map((value, j) => (
							<input
								key={j}
								type="number"
								value={value}
								onChange={(e) => handleChange(selectedChannel, i, j, e.target.value)}
								className="kernel-cell"
							/>
						))}
					</div>
				))}
		  </div>
      <PresetSelector onKernelChange={props.onKernelChange} />
    </div>
  );
}

export default KernelEditor;
