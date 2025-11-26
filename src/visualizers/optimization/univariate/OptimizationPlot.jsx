import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';
import "../styles.css";

const math = create(all);

function sampleFunction(expr, xMin = -1, xMax = 1, numPoints = 200) {
  const xs = [];
  const ys = [];
  const step = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; ++i) {
    const x = xMin + i * step;
    let y;
    try {
      y = expr.evaluate({ x });
    } catch {
      y = NaN;
    }
    xs.push(x);
    ys.push(y);
  }

  return { xs, ys };
}

function updateFunction(functionInput, setXs, setYs) {
  if (!functionInput) {
    setXs([]);
    setYs([]);
    return;
  }

  const expr = math.compile(functionInput);
  const { xs, ys } = sampleFunction(expr);
  setXs(xs);
  setYs(ys);
}

function OptimizationPlot(props) {
  const [xs, setXs] = useState([]);
  const [ys, setYs] = useState([]);

  useEffect(() => {
    updateFunction(props.functionInput, setXs, setYs);
  }, [props.functionInput]);

  return (
    <div className="plot-wrapper">
      <Plot 
        data={[
          {
            x: xs,
            y: ys,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#1f77b4', width: 2 },
            hoverinfo: 'skip',
          },
          {
            x: props.trajectory.map(p => p.x),
            y: props.trajectory.map(p => p.y),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'red', width: 2 },
            marker: { color: 'red', size: 10 },
          }
        ]}
        layout={{
          xaxis: { title: { text: 'x' } },
          yaxis: { title: { text: 'f(x)' } },
          margin: { t: 20, r: 20, b: 40, l: 50 },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
        className="plot"
      />
    </div>
  );
}

export default OptimizationPlot;
