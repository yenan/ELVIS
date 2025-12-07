import "./LayerViewer.css";

function OutputLayerViewer(props) {
  const probs = props.probs;
  const numClasses = probs.length;

  return (
    <div className="layer-viewer">
      <h3 className="layer-title">Output Layer (softmax)</h3>

      <div className="layer-details">
        <div><strong>Number of Classes:</strong> {numClasses}</div>
      </div>

      <h4>Class Probabilities</h4>
      <div className="layer-grid output-layer-grid">
        {Array.from({ length: numClasses }).map((_, i) => (
          <div key={i} className="output-class-probability">
            <strong>Class {i}:</strong> {(probs[i]).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}


export default OutputLayerViewer;
