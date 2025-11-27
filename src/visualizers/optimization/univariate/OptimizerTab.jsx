import Button from "../../../components/Button/Button.jsx";

const DEFAULT_PARAMS = {
  gd: { x0: "0.5", learningRate: "0.1", momentum: "0.0" },
  newton: { x0: "0.5" },
};

function handleOptimizerChange(
  event, setOptimizer, setParams
) {
  const selectedOptimizer = event.target.value;
  setOptimizer(selectedOptimizer);
  setParams(DEFAULT_PARAMS[selectedOptimizer]);
}

function handleRandomX0(params, setParams, min, max) {
  min = parseFloat(min);
  max = parseFloat(max);
  if (isNaN(min) || isNaN(max) || min >= max) {
    return;
  }

  const randomX0 = Math.random() * (max - min) + min
  setParams({
    ...params,
    x0: randomX0,
  });
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
        </select>
      </div>
      {props.optimizer === "gd" && (
        <>
          <div className="field">
            <label htmlFor="gd-x0-input">Initial x</label>
            <div className="input-button">
              <input
                id="gd-x0-input"
                type="text"
                value={props.params.x0}
                onChange={(e) =>
                  props.setParams({
                    ...props.params,
                    x0: e.target.value,
                  })
                }
              />
              <Button
                onClick={() =>
                  handleRandomX0(
                    props.params,
                    props.setParams,
                    props.xMin,
                    props.xMax
                  )
                }
              >
                Random
              </Button>
            </div>
          </div>
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
        <div className="field">
          <label htmlFor="newton-x0-input">Initial x</label>
          <div className="input-button">
            <input
              id="newton-x0-input"
              type="text"
              value={props.params.x0}
              onChange={(e) =>
                props.setParams({
                  ...props.params,
                  x0: e.target.value,
                })
              }
            />
            <Button
              onClick={() =>
                handleRandomX0(
                  props.params,
                  props.setParams,
                  props.xMin,
                  props.xMax
                )
              }
            >
              Random
            </Button>
          </div>
        </div>
      )} 
    </div>
  );
}

export default OptimizerTab;
