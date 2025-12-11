import Model from './model.js';
import { useState } from 'react';


function getDataForTraining(dataset, dataSource, pallette = null) {
  if (!dataset) {
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
  const model = new Model(modelType, hyperparameters);
  model.train(X, y);

  setModel(model);
}

function ModelTab(props) {
  const [modelType, setModelType] = useState("KNN");
  const [hyperparameters, setHyperparameters] = useState({k: 3});

  return (
    <div>
      <h2>Model Settings</h2>
      <p>Model configuration options will go here.</p>
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
