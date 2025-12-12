import { useState, useMemo, useEffect } from "react";
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

function loadCsv(file, setDataset, dataSource) {
  const reader = new FileReader();
  reader.onload = () => {
    const csvText = reader.result;
    let newDataset = {};
    if (dataSource === "manual") {
      newDataset = textToDataset(csvText);
    } else {
      newDataset = textToDataset(csvText);
    }
    setDataset(newDataset);
  };
  reader.readAsText(file);
}

function computeDecisionRegionPoints(model, plotDomain, resolution = 200, outResolution = 20) {
  const xRange = plotDomain.x[1] - plotDomain.x[0];
  const yRange = plotDomain.y[1] - plotDomain.y[0];

  const halfXRange = Math.floor(xRange / 2);
  const halfYRange = Math.floor(yRange / 2);

  const x0 = plotDomain.x[0];
  const y0 = plotDomain.y[0];

  let xs = [];
  let ys = [];
  
  // out region
  for (let i = 0; i < outResolution; ++i) {
    const x = x0 - halfXRange + (i / (outResolution - 1)) * halfXRange;
    const y = y0 - halfYRange + (i / (outResolution - 1)) * halfYRange;
    xs.push(x);
    ys.push(y);
  }

  // in region
  for (let i = 0; i < resolution; ++i) {
    const x = x0 + (i / (resolution - 1)) * xRange;
    const y = y0 + (i / (resolution - 1)) * yRange;
    xs.push(x);
    ys.push(y);
  }

  // out region
  for (let i = 0; i < outResolution; ++i) {
    const x = x0 + xRange + (i / (outResolution - 1)) * halfXRange;
    const y = y0 + yRange + (i / (outResolution - 1)) * halfYRange;
    xs.push(x);
    ys.push(y);
  }
  
  if (!model) {
    return { x: xs, y: ys, labels: null };
  }

  let labels = [];
  for (let i = 0; i < ys.length; ++i) {
    const y = ys[i];
    let row = [];

    for (let j = 0; j < xs.length; ++j) {
      const x = xs[j];
      const pred = model.predict([[x, y]]);
      row.push(pred[0]);
    }
    labels.push(row);
  }

  return { x: xs, y: ys, labels: labels };
}

function DecisionBoundary() {
	const [dataSource, setDataSource] = useState("manual");
  const [dataset, setDataset] = useState({});

  const [plotDomain, setPlotDomain] = useState({
    x: [-1, 1],
    y: [-1, 1],
  });

  const [model, setModel] = useState(null);

  const decisionRegionPoints = useMemo(() => {
    return computeDecisionRegionPoints(model, plotDomain);
  }, [model, plotDomain]);

  // only for manual data source
  const [pointLabel, setPointLabel] = useState("Black");

  // reset model when dataset changes
  useEffect(() => {
    setModel(null);
  }, [dataset, dataSource]);

	return (
		<div>
			<h1>Decision Boundary Visualizer</h1>
			<div className="visualizer-container">
		    <ClickablePlot 
          dataset={dataset}

          addDataPoint={(point, label) => addDataPoint(dataset, setDataset, point, label)}
          pointLabel={pointLabel}
          pallette={OKABE_ITO_COLORS}
          canAddPoints={dataSource === "manual"}

          domain={plotDomain}
          setDomain={setPlotDomain}
          decisionRegionPoints={decisionRegionPoints}
				/>

        <Sidebar 
          dataSource={dataSource}
          setDataSource={(source) => {
            setDataSource(source);
            setDataset({});
          }}

          pointLabel={pointLabel}
          setPointLabel={setPointLabel}
          pallette={OKABE_ITO_COLORS}

          downloadCsv={() => downloadCsv(dataset)}
          clearData={() => clearData(setDataset)}
          loadCsv={(file) => loadCsv(file, setDataset)}

          dataset={dataset}
          setModel={setModel}
        />
			</div>
		</div>
	);
}

export default DecisionBoundary;
