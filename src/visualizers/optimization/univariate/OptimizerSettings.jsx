const DEFAULT_PARAMS = {
  gd: { x0: 0.5, learningRate: 0.1, momentum: 0.0 },
  newton: { x0: 0.5 },
};

function handleOptimizerChange(
  event, setOptimizer, setParams
) {
  const selectedOptimizer = event.target.value;
  setOptimizer(selectedOptimizer);
  setParams(DEFAULT_PARAMS[selectedOptimizer]);
}

function OptimizerSettings(props) {
  return (
    <>
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
        </select>
      </div>
      {props.optimizer === "gd" && (
        <>
          <div className="field">
            <label htmlFor="gd-x0-input">Initial x</label>
            <input
              id="gd-x0-input"
              type="number"
              value={props.params.x0}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  x0: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="gd-learning-rate-input">Learning Rate</label>
            <input
              id="gd-learning-rate-input"
              type="number"
              value={props.params.learningRate}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  learningRate: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="gd-momentum-input">Momentum</label>
            <input
              id="gd-momentum-input"
              type="number"
              value={props.params.momentum}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  momentum: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </>
      )}
      {props.optimizer === "newton" && (
        <div className="field">
          <label htmlFor="newton-x0-input">Initial x</label>
          <input
            id="newton-x0-input"
            type="number"
            value={props.params.x0}
            onChange={(e) =>
              props.setParams({
                ...props.params,
                x0: parseFloat(e.target.value),
              })
            }
          />
        </div>
      )} 
    </>
  );
}

export default OptimizerSettings;
