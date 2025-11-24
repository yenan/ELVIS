import { useState } from "react";
import "./ArchitectureEditor.css";

function ArchitectureEditor() {
  const [layers, setLayers] = useState([
    {
      type: "conv",
      kernelSize: 5,
      filters: 8,
      stride: 1,
      padding: 1,
      activation: "relu",
    },
    {
      type: "maxpool",
      kernelSize: 2,
      stride: 2,
      padding: 0,
    },
    {
      type: "conv",
      kernelSize: 5,
      filters: 16,
      stride: 1,
      padding: 1,
      activation: "relu",
    },
    {
      type: "maxpool",
      kernelSize: 2,
      stride: 2,
      padding: 0,
    },
    {
      type: "dense",
      units: 10,
      activation: "softmax",
    },
  ]);

  function updateLayer(index, field, value) {
    setLayers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  }

  function addLayer() {
    setLayers((prev) => [
      ...prev,
      {
        type: "conv",
        kernelSize: 3,
        filters: 8,
        stride: 1,
        padding: 1,
        activation: "relu",
      },
    ]);
  }

  function removeLayer(index) {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="cnn-editor">
      <div className="layers">
        {layers.map((layer, index) => (
          <div
            key={index}
            className="layer-card"
          >
            <div className="layer-header">
              <strong>Layer {index + 1}</strong>

              <button
                className="remove-btn"
                onClick={() => removeLayer(index)}
              >
                Remove
              </button>
            </div>

            <div className="layer-grid">
              {/* Type */}
              <div className="field">
                <label>Type</label>

                <select
                  value={layer.type}
                  onChange={(e) =>
                    updateLayer(index, "type", e.target.value)
                  }
                >
                  <option value="conv">Conv</option>
                  <option value="maxpool">Max Pool</option>
                  <option value="avgpool">Avg Pool</option>
                  <option value="dense">Dense</option>
                </select>
              </div>

              {/* Conv fields */}
              {layer.type === "conv" && (
                <>
                  <div className="field">
                    <label>Filters</label>

                    <input
                      type="number"
                      value={layer.filters}
                      onChange={(e) =>
                        updateLayer(index, "filters", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Kernel Size</label>

                    <input
                      type="number"
                      value={layer.kernelSize}
                      onChange={(e) =>
                        updateLayer(index, "kernelSize", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Stride</label>

                    <input
                      type="number"
                      value={layer.stride}
                      onChange={(e) =>
                        updateLayer(index, "stride", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Padding</label>

                    <input
                      type="number"
                      value={layer.padding}
                      onChange={(e) =>
                        updateLayer(index, "padding", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Activation</label>

                    <select
                      value={layer.activation}
                      onChange={(e) =>
                        updateLayer(index, "activation", e.target.value)
                      }
                    >
                      <option value="relu">ReLU</option>
                      <option value="sigmoid">Sigmoid</option>
                      <option value="tanh">Tanh</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </>
              )}

              {/* Pool fields */}
              {(layer.type === "maxpool" || layer.type === "avgpool") && (
                <>
                  <div className="field">
                    <label>Kernel Size</label>

                    <input
                      type="number"
                      value={layer.kernelSize}
                      onChange={(e) =>
                        updateLayer(index, "kernelSize", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Stride</label>

                    <input
                      type="number"
                      value={layer.stride}
                      onChange={(e) =>
                        updateLayer(index, "stride", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Padding</label>

                    <input
                      type="number"
                      value={layer.padding}
                      onChange={(e) =>
                        updateLayer(index, "padding", Number(e.target.value))
                      }
                    />
                  </div>
                </>
              )}

              {/* Dense fields */}
              {layer.type === "dense" && (
                <>
                  <div className="field">
                    <label>Units</label>

                    <input
                      type="number"
                      value={layer.units}
                      onChange={(e) =>
                        updateLayer(index, "units", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Activation</label>

                    <select
                      value={layer.activation}
                      onChange={(e) =>
                        updateLayer(index, "activation", e.target.value)
                      }
                    >
                      <option value="relu">ReLU</option>
                      <option value="sigmoid">Sigmoid</option>
                      <option value="tanh">Tanh</option>
                      <option value="softmax">Softmax</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="add-btn"
        onClick={addLayer}
      >
        + Add Layer
      </button>
    </div>
  );
}

export default ArchitectureEditor;
