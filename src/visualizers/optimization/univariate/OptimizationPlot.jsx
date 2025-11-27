import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';
import "../styles.css";

const math = create(all);

function sampleFunction(expr, xMin, xMax, numPoints = 200) {
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

function updateFunction(functionInput, setXs, setYs, xMin, xMax) {
  if (!functionInput) {
    setXs([]);
    setYs([]);
    return;
  }

  // parse xMin and xMax
  xMin = parseFloat(xMin);
  xMax = parseFloat(xMax);
  if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax) {
    setXs([]);
    setYs([]);
    return;
  }

  try {
    const expr = math.compile(functionInput);
    const { xs, ys } = sampleFunction(expr, xMin, xMax);
    setXs(xs);
    setYs(ys);
  } catch {
    setXs([]);
    setYs([]);
  }
}

function OptimizationPlot(props) {
  const [xs, setXs] = useState([]);
  const [ys, setYs] = useState([]);

  useEffect(() => {
    updateFunction(props.functionInput, setXs, setYs, props.functionXMin, props.functionXMax);
  }, [props.functionInput, props.functionXMin, props.functionXMax]);

  const trajX = props.trajectory.map(p => p.x);
  const trajY = props.trajectory.map(p => p.y);

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
            x: trajX,
            y: trajY,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#ccc393', width: 2 },
            marker: { color: '#ccc393', size: 10 },
            hoverinfo: 'skip',
          },
          {
            x: [trajX.at(-1)],
            y: [trajY.at(-1)],
            type: 'scatter',
            mode: 'markers',
            line: { color: 'orange', width: 2 },
            marker: { color: 'orange', size: 12 },
            hoverinfo: 'skip',
          },
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
