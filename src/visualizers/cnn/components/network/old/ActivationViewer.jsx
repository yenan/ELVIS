import "./ActivationViewer.css";

function ActivationViewer(props) {
  return (
    <div className="activations">
        {props.sampleImage && (
          <div>
            <div className="sample-header">
              <h3>Sample Input</h3>
              <button
                onClick={props.onSampleChange}
              >
                Change
              </button>
            </div>
            <img src={props.sampleImage} alt="Sample Input" />
          </div>
        )}

      {props.activations &&
        props.activations.length > 0 &&
        props.activations.map((layer, i) => (
          <div key={i} className="activation-layer">
            <h3>Layer {i + 1} Activations</h3>
            <div className="activation-maps">
              {layer.map((map, j) => (
                <img
                  key={j}
                  src={map}
                  alt={`Layer ${i + 1} Map ${j + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default ActivationViewer;
