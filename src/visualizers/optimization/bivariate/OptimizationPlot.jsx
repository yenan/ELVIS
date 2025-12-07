import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';
import "../styles.css";

const math = create(all);


function getContourPoints(
  func, dx, dy, xMin, xMax, yMin, yMax, numPoints = 100
) {
  const xs = [];
  const ys = [];
  const zs = [];
	const gradXs = [];
	const gradYs = [];

  const stepX = (xMax - xMin) / (numPoints - 1);
  const stepY = (yMax - yMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; ++i) {
    const y = yMin + i * stepY;

    xs.push([]);
    ys.push([]);
    zs.push([]);
		gradXs.push([]);
		gradYs.push([]);

    for (let j = 0; j < numPoints; ++j) {
      const x = xMin + j * stepX;

      let z;
      try {
        z = func.evaluate({ x, y });
      } catch {
        z = NaN;
      }

			let gradX, gradY;
			try {
				gradX = dx.evaluate({ x, y });
				gradY = dy.evaluate({ x, y });
			} catch {
				gradX = NaN;
				gradY = NaN;
			}

      xs[i].push(x);
      ys[i].push(y);
      zs[i].push(z);
			gradXs[i].push(gradX);
			gradYs[i].push(gradY);
    }
  }

  return { xs, ys, zs, gradXs, gradYs };
}


function updateFunction(
  functionInput, 
  setXs, 
  setYs, 
  setZs,
	setGradXs,
	setGradYs,
  xMin, 
  xMax,
  yMin, 
  yMax
) {
  if (!functionInput) {
    setXs([]);
    setYs([]);
    setZs([]);
		setGradXs([]);
		setGradYs([]);
    return;
  }

  // parse xMin and xMax
  xMin = parseFloat(xMin);
  xMax = parseFloat(xMax);
  yMin = parseFloat(yMin);
  yMax = parseFloat(yMax);
  if (
    isNaN(xMin) || 
    isNaN(xMax) || 
    xMin >= xMax ||
    isNaN(yMin) || 
    isNaN(yMax) || 
    yMin >= yMax
  ) {
    setXs([]);
    setYs([]);
    setZs([]);
		setGradXs([]);
		setGradYs([]);
    return;
  }

  try {
    const expr = math.compile(functionInput);
		const dx = math.derivative(functionInput, 'x').compile();
		const dy = math.derivative(functionInput, 'y').compile();

    const { xs, ys, zs, gradXs, gradYs } = getContourPoints(
      expr, dx, dy, xMin, xMax, yMin, yMax
    );
    setXs(xs);
    setYs(ys);
    setZs(zs);
		setGradXs(gradXs);
		setGradYs(gradYs);
  } catch {
		console.log("bonjourno");
    setXs([]);
    setYs([]);
    setZs([]);
		setGradXs([]);
		setGradYs([]);
  }
}

function OptimizationPlot(props) {
	const [hoverEnabled, setHoverEnabled] = useState(false);

  const [xs, setXs] = useState([]);
  const [ys, setYs] = useState([]);
  const [zs, setZs] = useState([]);
	const [gradXs, setGradXs] = useState([]);
	const [gradYs, setGradYs] = useState([]);

  const trajX = props.trajectory.map(point => point.x);
  const trajY = props.trajectory.map(point => point.y);
  const trajZ = props.trajectory.map(point => point.z);

  useEffect(() => {
    updateFunction(
      props.functionInput, 
      setXs, 
      setYs, 
      setZs, 
			setGradXs,
			setGradYs,
      props.functionXMin, 
      props.functionXMax, 
      props.functionYMin, 
      props.functionYMax
    );
  }, [
    props.functionInput, 
    props.functionXMin, 
    props.functionXMax,
    props.functionYMin, 
    props.functionYMax
  ]);

	const customData = gradXs.map((row, i) => 
		row.map((dx, j) => [dx, gradYs[i][j]])
	);

  return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div className="plot-wrapper">
				<Plot 
					data={[
						{
							x: xs[0],
							y: ys.map(row => row[0]),
							z: zs,
							type: 'contour',
							contours: {
								coloring: 'heatmap',
								showlines: false,
							},
							colorscale: 'Viridis',
							customdata: customData,
							hovertemplate: "p=(%{x:.2f}, %{y:.2f}, %{z:.2f})<br>grad=(%{customdata[0]:.2f}, %{customdata[1]:.2f})<extra></extra>"
						},
						{
							x: trajX,
							y: trajY,
							type: 'scatter',
							mode: 'lines+markers',
							line: { color: '#d97871', width: 2 },
							marker: { color: '#d97871', size: 10 },
							hoverinfo: "skip",
						},
						{
							x: [trajX.at(-1)],
							y: [trajY.at(-1)],
							type: 'scatter',
							mode: 'markers',
							marker: { color: 'red', size: 12 },
							hoverinfo: "skip",
						},
					]}
					layout={{
						autosize: true,
						margin: { t: 20, r: 20, b: 40, l: 50 },
						xaxis: { 
							title: { text: 'x' },
							scaleanchor: null,
							range: [props.functionXMin, props.functionXMax]
						},
						yaxis: { 
							title: { text: 'y' },
							scaleanchor: null,
							range: [props.functionYMin, props.functionYMax]
						},
						showlegend: false,
						hovermode: hoverEnabled ? "closest" : false,
					}}
					config={{ responsive: true, displayModeBar: false }}
					style={{ width: '100%', height: '100%' }}
					useSizeHandler={true}
					className="plot"
				/>
			</div>
			<div className="card">
				<label>
					<input
						type="checkbox"
						checked={hoverEnabled}
						onChange={(e) => setHoverEnabled(e.target.checked)}
					/>
					Show info on hover
				</label>
			</div>
		</div>
  );
}

export default OptimizationPlot;
