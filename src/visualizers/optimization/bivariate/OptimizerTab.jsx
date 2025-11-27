import InitialPointInput from "./InitialPointInput.jsx";

const DEFAULT_PARAMS = {
  gd: { x0: "0.5", y0: "0.5", learningRate: "0.1", momentum: "0.0" },
  newton: { x0: "0.5", y0: "0.5" },
  adam: { x0: "0.5", y0: "0.5", learningRate: "0.1", beta1: "0.9", beta2: "0.999", epsilon: "1e-8" },
};

function handleOptimizerChange(
  event, setOptimizer, setParams
) {
  const selectedOptimizer = event.target.value;
  setOptimizer(selectedOptimizer);
  setParams(DEFAULT_PARAMS[selectedOptimizer]);
}


function OptimizerTab(props) {
  return (
    <div className="controls">
      <div className="field">
        <label htmlFor="optimizer-select">Optimizer</label>
        <select
          id="optimizer-select"
          value={props.optimizer}
          onChange={(e) => handleOptimizerChange(
            e, props.setOptimizer, props.setParams
          )}
        >
          <option value="gd">Gradient Descent</option>
          <option value="newton">Newton's Method</option>
          <option value="adam">Adam</option>
        </select>
      </div>
      {props.optimizer === "gd" && (
        <>
          <InitialPointInput
            params={props.params}
            setParams={props.setParams}
            xMin={props.xMin}
            xMax={props.xMax}
            yMin={props.yMin}
            yMax={props.yMax}
          />
          <div className="field">
            <label htmlFor="gd-learning-rate-input">Learning Rate</label>
            <input
              id="gd-learning-rate-input"
              type="text"
              value={props.params.learningRate}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  learningRate: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="gd-momentum-input">Momentum</label>
            <input
              id="gd-momentum-input"
              type="text"
              value={props.params.momentum}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  momentum: e.target.value,
                })
              }
            />
          </div>
        </>
      )}
      {props.optimizer === "newton" && (
        <InitialPointInput
          params={props.params}
          setParams={props.setParams}
          xMin={props.xMin}
          xMax={props.xMax}
          yMin={props.yMin}
          yMax={props.yMax}
        />
      )} 
      {props.optimizer === "adam" && (
        <>
          <InitialPointInput
            params={props.params}
            setParams={props.setParams}
            xMin={props.xMin}
            xMax={props.xMax}
            yMin={props.yMin}
            yMax={props.yMax}
          />
          <div className="field">
            <label htmlFor="adam-learning-rate-input">Learning Rate</label>
            <input
              id="adam-learning-rate-input"
              type="text"
              value={props.params.learningRate}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  learningRate: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="adam-beta1-input">Beta 1</label>
            <input
              id="adam-beta1-input"
              type="text"
              value={props.params.beta1}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  beta1: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="adam-beta2-input">Beta 2</label>
            <input
              id="adam-beta2-input"
              type="text"
              value={props.params.beta2}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  beta2: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="adam-epsilon-input">Epsilon</label>
            <input
              id="adam-epsilon-input"
              type="text"
              value={props.params.epsilon}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  epsilon: e.target.value,
                })
              }
            />
          </div>
        </>
      )} 
    </div>
  );
}

export default OptimizerTab;
