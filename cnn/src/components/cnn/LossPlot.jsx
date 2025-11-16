import Plot from "react-plotly.js";

function LossPlot(props) {
  return (
    <Plot
      data={[
        {
          x: props.epochs,
          y: props.loss,
          type: "scatter",
          mode: "lines",
          name: "Training Loss",
          line: { color: "red" },
        },
        {
          x: props.epochs,
          y: props.valLoss,
          type: "scatter",
          mode: "lines",
          name: "Validation Loss",
          line: { color: "orange" },
        },
      ]}
      layout={{
        title: "Training Curves",
        autosize: true,
        xaxis: { title: "Epoch" },
        yaxis: { title: "Cross Entropy Loss" },
        legend: { orientation: "h" },
        margin: { t: 40 },
      }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}

export default LossPlot;
