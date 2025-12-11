import { useState } from "react";
import ClickablePlot from "./ClickablePlot.jsx";
import Sidebar from "./Sidebar.jsx";
import { OKABE_ITO_COLORS } from "./colors.js";
import "./styles.css";

function addDataPoint(dataset, setDataset, point, label) {
  setDataset(prev => {
    const next = structuredClone(prev);

    if (!next[label]) {
      next[label] = { x: [], y: [] };
    }
    
    next[label].x.push(point.x);
    next[label].y.push(point.y);

    return next;
  });
}

function downloadCsv(dataset) {
  const rows = [["x", "y", "label"]];

  for (const label in dataset) {
    const xs = dataset[label].x;
    const ys = dataset[label].y;
    for (let i = 0; i < xs.length; ++i) {
      rows.push([xs[i], ys[i], label]);
    }
  }

  const csvContent = rows.map(row => row.join(",")).join("\n");

  // create csv file and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "dataset.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function clearData(setDataset) {
  setDataset({});
}

function textToDataset(csvText) {
  // assume csv format: x,y,label
  // will ignore headers and invalid lines
  
  const lines = csvText.trim().split("\n");
  const dataset = {};

  for (const line of lines) {
    try {

      if (!line.trim()) {
        continue;
      }

      const cells = line.split(",");
      if (cells.length !== 3) {
        continue;
      }

      let [xStr, yStr, label] = cells;

      xStr = xStr.trim();
      yStr = yStr.trim();
      label = label.trim();

      const x = parseFloat(xStr);
      const y = parseFloat(yStr);

      if (isNaN(x) || isNaN(y) || !label) {
        continue;
      }

      if (!dataset[label]) {
        dataset[label] = { x: [], y: [] };
      }

      dataset[label].x.push(x);
      dataset[label].y.push(y);

    } catch (e) {
      // skip invalid lines
      continue;
    }
  }

  return dataset;
}

function loadCsv(file, setDataset) {
  const reader = new FileReader();
  reader.onload = () => {
    const csvText = reader.result;
    setDataset(textToDataset(csvText));
  };
  reader.readAsText(file);
}

function DecisionBoundary() {
	const [dataSource, setDataSource] = useState("manual");
  const [dataset, setDataset] = useState({});

  // only for manual data source
  const [pointLabel, setPointLabel] = useState("Black");

	return (
		<div>
			<h1>Decision Boundary Visualizer</h1>
			<div className="visualizer-container">
		    <ClickablePlot 
          dataset={dataset}
          addDataPoint={(point, label) => addDataPoint(dataset, setDataset, point, label)}
          pointLabel={pointLabel}
          pallette={OKABE_ITO_COLORS}
				/>
        <Sidebar 
          dataSource={dataSource}
          setDataSource={setDataSource}
          pointLabel={pointLabel}
          setPointLabel={setPointLabel}
          pallette={OKABE_ITO_COLORS}
          downloadCsv={() => downloadCsv(dataset)}
          clearData={() => clearData(setDataset)}
          loadCsv={(file) => loadCsv(file, setDataset)}
        />
			</div>
		</div>
	);
}

export default DecisionBoundary;
