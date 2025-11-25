import Plot from 'react-plotly.js';

function NetworkViewer(props) {
  return (
    <div>
			<p>Training status: {
				props.isTraining
					? "Running"
					: "Not running"
			}</p>
			<Plot
				data={[
					{
						x: props.losses.map((_, i) => i),
						y: props.losses.map(l => l.loss),
						mode: "lines",
						type: "scatter"
					}
				]}
				layout={{
					xaxis: { title: { text: "Training steps" } },
					yaxis: { title: { text: "Train loss" } },
				}}
			/>
    </div>
  );
}

export default NetworkViewer;
