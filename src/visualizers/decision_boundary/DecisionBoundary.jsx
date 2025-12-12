import { useState, useMemo, useEffect, useRef } from "react";
import ClickablePlot from "./ClickablePlot.jsx";
import Sidebar from "./Sidebar.jsx";
import { OKABE_ITO_COLORS } from "./colors.js";
import { Dataset } from "./dataset.js";
import "./styles.css";

function addDataPoint(dataset, setDataset, point, label) {
  const newDataset = dataset.addDataPoint(point, label);
  setDataset(newDataset);
}

function downloadCsv(dataset) {
  const data = dataset.getDataForTrain();
  if (!data || data.features.length === 0) {
    alert("No data to download.");
    return;
  }

  const numFeatures = data.features[0].length;
  let header = Array.from({ length: numFeatures }, (_, i) => `x${i + 1}`);
  header.push("y");

  let rows = [header];

  for (let i = 0; i < data.features.length; ++i) {
    const featureRow = data.features[i];
    const label = data.labels[i];
    rows.push([...featureRow, label]);
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

function clearData(dataset, setDataset) {
  const newDataset = dataset.clearData();
  setDataset(newDataset);
}

function textToDataset(csvText) {
  // assume csv format: x1,x2,...,xn,label
  // will ignore headers and invalid lines
  
  const lines = csvText.trim().split("\n");
  let dataset = new Dataset();

  for (const line of lines) {
    try {

      if (!line.trim()) {
        continue;
      }

      const cells = line.split(",");
      if (cells.length < 3) {
        continue;
      }

      const x = cells.slice(0, -1).map(v => parseFloat(v.trim()));
      const label = cells[cells.length - 1].trim();

      if (x.some(v => isNaN(v)) || label === "") {
        continue;
      }

      // todo - this is probably slow for large datasets
      dataset = dataset.addDataPoint(x, label);

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
    const newDataset = textToDataset(csvText);
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
  const [dataset, setDataset] = useState(new Dataset());

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
          clearData={() => clearData(dataset, setDataset)}
          loadCsv={(file) => loadCsv(file, setDataset)}

          dataset={dataset}
          setModel={setModel}
        />
			</div>
		</div>
	);
}

export default DecisionBoundary;
