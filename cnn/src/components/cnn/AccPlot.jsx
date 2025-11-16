import Plot from "react-plotly.js";

function AccPlot(props) {
  return (
    <Plot
      data={[
        {
          x: props.epochs,
          y: props.acc,
          type: "scatter",
          mode: "lines",
          name: "Training Accuracy",
          line: { color: "red" },
					xlabel: "Epochs",
					ylabel: "Accuracy"
        },
        {
          x: props.epochs,
          y: props.valAcc,
          type: "scatter",
          mode: "lines",
          name: "Validation Accuracy",
          line: { color: "orange" },
					xlabel: "Epochs",
					ylabel: "Accuracy"
        },
      ]}
      layout={{
        title: "Training Curves",
        autosize: true,
        xaxis: { title: "Epoch" },
        yaxis: { title: "Value" },
        legend: { orientation: "h" },
        margin: { t: 40 },
      }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}

export default AccPlot;
