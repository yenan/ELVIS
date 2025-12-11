import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

function ClickablePlot(props) {
  const plotRef = useRef(null);
  const layoutRef = useRef({
    width: 900,
    height: 600,
    dragmode: "pan",
    xaxis: { 
      range: [-1, 1],
      automargin: true,
    },
    yaxis: { 
      range: [-1, 1],
      automargin: true,
    },
    margin: { t: 0, b: 0, l: 0, r: 0 },
  });

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

      props.addDataPoint({ x: xVal, y: yVal }, props.pointLabel);

    }

    plotEl.addEventListener("click", handleClick);

    return () => {
      plotEl.removeEventListener("click", handleClick);
    };
  }, [props.addDataPoint, props.pointLabel]);

  const dataTraces = props.dataset 
    ? Object.entries(props.dataset).map(([label, points]) => ({
        x: points.x,
        y: points.y,
        mode: "markers",
        marker: { size: 10, color: props.pallette.find(c => c.name === label)?.value || "black" },
        type: "scatter",
        name: label,
      }))
    : [];

  return (
		<div className="plot-container">
			<Plot
				ref={plotRef}
				data={dataTraces}
				layout={layoutRef.current}
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
