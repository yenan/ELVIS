import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

function ClickablePlot(props) {
  const plotRef = useRef(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const plotEl = plotRef.current?.el;
    if (!plotEl) {
      return;
    }

    function handleClick(evt) {
      const gd = plotEl;

      // bounding box of the entire plot div
      const rect = gd.getBoundingClientRect();

      // pixel positions relative to the plot
      const xPixel = evt.clientX - rect.left;
      const yPixel = evt.clientY - rect.top;

      // full layout (contains xaxis/yaxis + offsets)
      const fullLayout = gd._fullLayout;

      const xaxis = fullLayout.xaxis;
      const yaxis = fullLayout.yaxis;

      // IMPORTANT:
      // Subtract axis offsets — this aligns pixel space to graph space.
      const xInGraph = xPixel - xaxis._offset;
      const yInGraph = yPixel - yaxis._offset;

      // Convert pixel → data coordinate
      const xVal = xaxis.p2c(xInGraph);
      const yVal = yaxis.p2c(yInGraph);

      // Ignore clicks outside plot area
      if (!isFinite(xVal) || !isFinite(yVal)) {
        return;
      }

      setPoints((prev) => {
        return [
          ...prev,
          { x: xVal, y: yVal }
        ];
      });
    }

    plotEl.addEventListener("click", handleClick);

    return () => {
      plotEl.removeEventListener("click", handleClick);
    };
  }, []);

  const trace = {
    x: points.map((p) => p.x),
    y: points.map((p) => p.y),
    mode: "markers",
    marker: { size: 10 }
  };

  return (
		<div className="plot-container">
			<Plot
				ref={plotRef}
				data={[trace]}
				layout={{
					width: 900,
					height: 600,
					dragmode: "zoom",
					xaxis: { range: [props.xMin, props.xMax] },
					yaxis: { range: [props.yMin, props.yMax] },
					margin: { l: 15 , r: 15, b: 15, t: 15 }
				}}
				config={{
					scrollZoom: true,
					displayModeBar: false
				}}
				style={{ width: "100%", height: "100%" }}
			/>
		</div>
  );
}

export default ClickablePlot;
