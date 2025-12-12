import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import { makeClassColorScale } from "./colors.js";

function ClickablePlot(props) {
  const plotRef = useRef(null);
  const layoutRef = useRef({
    width: 900,
    height: 600,
    dragmode: "pan",
    xaxis: { 
      range: props.domain.x,
    },
    yaxis: { 
      range: props.domain.y,
    },
    margin: { t: 0, b: 20, l: 20, r: 0 }
  });

  // click to add points handling
  useEffect(() => {
    const plotEl = plotRef.current?.el;
    if (!plotEl) {
      return;
    }

    function handleClick(evt) {
      if (!props.canAddPoints) {
        return;
      }

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

  // x and y domain change handling
  useEffect(() => {
    const plotEl = plotRef.current?.el;
    if (!plotEl) {
      return;
    }

    function handleRelayout(evt) {
      if (evt["xaxis.range[0]"] !== undefined && evt["yaxis.range[0]"] !== undefined) {
        const newDomain = {
          x: [evt["xaxis.range[0]"], evt["xaxis.range[1]"]],
          y: [evt["yaxis.range[0]"], evt["yaxis.range[1]"]],
        };
        props.setDomain(newDomain);
      }
    }

    plotEl.on("plotly_relayout", handleRelayout);

    return () => {
      plotEl.removeListener("plotly_relayout", handleRelayout);
    };
  }, [props.setDomain]);

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

  const labelToIndex = Object.fromEntries(
    props.pallette.map((c, idx) => [c.name, idx])
  );
  const decisionRegionTrace = props.decisionRegionPoints && props.decisionRegionPoints.labels
    ? {
        x: props.decisionRegionPoints.x,
        y: props.decisionRegionPoints.y,
        z: props.decisionRegionPoints.labels.map(row =>
          row.map(label => labelToIndex[label] || 0)
        ),
        type: "heatmap",
        showscale: false,
        colorscale: makeClassColorScale(props.pallette),
        zmin: 0,
        zmax: props.pallette.length - 1,
        hoverinfo: "skip",
        opacity: 0.1,
      }
    : [];

  return (
		<div className="plot-container">
			<Plot
				ref={plotRef}
				data={[...dataTraces, decisionRegionTrace]}
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
