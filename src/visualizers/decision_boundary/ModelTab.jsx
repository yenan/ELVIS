import { getModel, DEFAULT_HYPERPARAMETERS } from './model.js';
import { useState } from 'react';


function getDataForTraining(dataset, dataSource) {
  const data = dataset?.getDataForTrain();
  const numClasses = dataset?.getNumClasses() || 0;

  if (!data || data.features.length === 0 || numClasses === 0) {
    return null;
  }

  const X = data.features;
  const y = data.labels;

  return { X, y, numClasses };
}

function handleTrainModel(dataset, modelType, hyperparameters, setModel) {
  const data = getDataForTraining(dataset);
  if (!data) {
    alert("Dataset is empty or invalid.");
    return;
  }
  
  const { X, y } = data;
  const model = getModel(modelType, hyperparameters);
  model.train(X, y);

  setModel(model);
}

function ModelTab(props) {
  const [modelType, setModelType] = useState("KNN");
  const [hyperparameters, setHyperparameters] = useState(DEFAULT_HYPERPARAMETERS["KNN"]);

  return (
    <div className="card">
      <div className="field">
        <label className="label">Model Type</label>
        <select
          value={modelType}
          onChange={(e) => {
            setModelType(e.target.value)
            setHyperparameters(DEFAULT_HYPERPARAMETERS[e.target.value])
          }}
        >
          <option value="KNN">K-Nearest Neighbors</option>
          <option value="LogisticRegression">Logistic Regression</option>
          <option value="DecisionTree">Decision Tree</option>
        </select>
      </div>

      {Object.entries(hyperparameters).map(([param, value]) => (
        <div className="field" key={param}>
          <label className="label">{param}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setHyperparameters({...hyperparameters, [param]: e.target.value})}
          />
        </div>
      ))}

      <button 
        onClick={() => {
          handleTrainModel(
            props.dataset, 
            modelType, 
            hyperparameters, 
            props.setModel, 
            props.dataSource, 
            props.pallette
          )
        }}
      >
        Train Model
      </button>
    </div>
  );
}

export default ModelTab;
