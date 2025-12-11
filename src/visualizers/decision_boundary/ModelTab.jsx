import { getModel, DEFAULT_HYPERPARAMETERS } from './model.js';
import { useState } from 'react';


function getDataForTraining(dataset, dataSource, pallette = null) {
  if (!dataset || Object.keys(dataset).length === 0) {
    return null;
  }

  let X = [];
  let y = [];
  let numClasses = 0;
  for (const label in dataset) {
    numClasses += 1;

    const xVals = dataset[label].x;
    const yVals = dataset[label].y;
    for (let i = 0; i < xVals.length; i++) {
      X.push([xVals[i], yVals[i]]);
      y.push(label);
    }
  }

  return { X, y, numClasses };
}

function handleTrainModel(dataset, modelType, hyperparameters, setModel) {
  const data = getDataForTraining(dataset);
  if (!data) {
    console.error("Invalid dataset provided for training.");
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
