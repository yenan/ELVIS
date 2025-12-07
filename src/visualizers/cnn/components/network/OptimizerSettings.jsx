import "../../styles.css";

const DEFAULT_PARAMS = {
  sgd: {
    learningRate: "0.01",
    momentum: "0.0",
    batchSize: "32",
    epochs: "5",
  },
  adam: {
    learningRate: "0.001",
    beta1: "0.9",
    beta2: "0.999",
    epsilon: "1e-8",
    batchSize: "32",
    epochs: "5",
  }
}


function handleOptimizerChange(event, onChange) {
  const selectedOptimizer = event.target.value;
  onChange(selectedOptimizer, DEFAULT_PARAMS[selectedOptimizer]);
}

function handleParamChange(param, value, oldParams, optimizerType, onChange) {
  const newParams = {
    ...oldParams,
    [param]: value,
  };
  onChange(optimizerType, newParams);
}


function OptimizerSettings(props) {
  return (
    <div className="card">
      <div className="field">
        <label htmlFor="optimizer-select">Optimizer</label>
        <select
          id="optimizer-select"
          value={props.optimizer}
          onChange={(e) => handleOptimizerChange(e, props.onOptimizerChange)}
        >
          <option value="sgd">Stochastic Gradient Descent</option>
          <option value="adam">Adam</option>
        </select>
      </div>
      {props.optimizer === "sgd" && (
        <>
          <div className="field">
            <label htmlFor="sgd-learning-rate-input">Learning Rate</label>
            <input
              id="sgd-learning-rate-input"
              type="text"
              value={props.params.learningRate}
              onChange={(e) => handleParamChange(
                'learningRate', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="sgd-momentum-input">Momentum</label>
            <input
              id="sgd-momentum-input"
              type="text"
              value={props.params.momentum}
              onChange={(e) => handleParamChange(
                'momentum', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="sgd-batch-size-input">Batch Size</label>
            <input
              id="sgd-batch-size-input"
              type="text"
              value={props.params.batchSize}
              onChange={(e) => handleParamChange(
                'batchSize', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="sgd-epochs-input">Epochs</label>
            <input
              id="sgd-epochs-input"
              type="text"
              value={props.params.epochs}
              onChange={(e) => handleParamChange(
                'epochs', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div> 
        </>
      )}
      {props.optimizer === "adam" && (
        <>
          <div className="field">
            <label htmlFor="adam-learning-rate-input">Learning Rate</label>
            <input
              id="adam-learning-rate-input"
              type="text"
              value={props.params.learningRate}
              onChange={(e) => handleParamChange(
                'learningRate', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="adam-beta1-input">Beta 1</label>
            <input
              id="adam-beta1-input"
              type="text"
              value={props.params.beta1}
              onChange={(e) => handleParamChange(
                'beta1', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="adam-beta2-input">Beta 2</label>
            <input
              id="adam-beta2-input"
              type="text"
              value={props.params.beta2}
              onChange={(e) => handleParamChange(
                'beta2', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="adam-epsilon-input">Epsilon</label>
            <input
              id="adam-epsilon-input"
              type="text"
              value={props.params.epsilon}
              onChange={(e) => handleParamChange(
                'epsilon', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="adam-batch-size-input">Batch Size</label>
            <input
              id="adam-batch-size-input"
              type="text"
              value={props.params.batchSize}
              onChange={(e) => handleParamChange(
                'batchSize', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="adam-epochs-input">Epochs</label>
            <input
              id="adam-epochs-input"
              type="text"
              value={props.params.epochs}
              onChange={(e) => handleParamChange(
                'epochs', e.target.value, props.params, props.optimizer, props.onOptimizerChange
              )}
            />
          </div>
        </>
      )}
			{ !props.isTraining && (
				<>
					<button onClick={props.onStartTraining}>
						Start Training
					</button>
					<button onClick={props.onResetTraining}>
						Reset Training
					</button>
				</>
			)}
			{ props.isTraining && (
				<>
					<button onClick={props.onPauseTraining}>
						Pause Training
					</button>
					<button onClick={props.onContinueTraining}>
						Continue Training
					</button>
					<button onClick={props.onStopTraining}>
						Stop Training
					</button>
				</>
			)}
    </div> 
  );
}

export default OptimizerSettings;
