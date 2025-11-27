import "./LayerViewer.css";

function OutputLayerViewer(props) {
  const probs = props.probs;
  const data = probs?.dataSync();
  const numClasses = data?.length;

  return (
    <div className="layer-viewer">
      <h3 className="layer-title">Output Layer</h3>

      <div className="layer-details">
        <div><strong>Number of Classes:</strong> {numClasses}</div>
      </div>

      <h4>Class Probabilities</h4>
      <div className="layer-grid output-layer-grid">
        {Array.from({ length: numClasses }).map((_, i) => (
          <div key={i} className="output-class-probability">
            <strong>Class {i}:</strong> {(data[i] * 100).toFixed(2)}%
          </div>
        ))}
      </div>
    </div>
  );
}


export default OutputLayerViewer;
