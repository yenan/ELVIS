import { Matrix } from 'ml-matrix';
import LogisticRegression from 'ml-logistic-regression';
import KNN from 'ml-knn';

class Model {
  constructor(modelType, hyperparameters = {}) {
    this.modelType = modelType;
    this.hyperparameters = hyperparameters;

    this.labelToInt = {};
    this.intToLabel = {};

    if (modelType === 'KNN') {
      this._model = null; // KNN will be initialized during training
    } else if (modelType === "LogisticRegression") {
      this._model = new LogisticRegression(hyperparameters);
    } else {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  _buildLabelMappings(y) {
    const uniqueLabels = Array.from(new Set(y));

    uniqueLabels.forEach((label, index) => {
      this.labelToInt[label] = index;
      this.intToLabel[index] = label;
    });
  }

  train(X, y) {
    this._buildLabelMappings(y);

    let yInt = y.map(label => this.labelToInt[label]);

    if (this.modelType === 'KNN') {
      this._model = new KNN(X, yInt, this.hyperparameters);
    } else {
      X = new Matrix(X);
      yInt = Matrix.columnVector(yInt);
      this._model.train(X, yInt);
    }
  }

  predict(X) {
    if (this.modelType !== 'KNN') {
      X = new Matrix(X);
    }
      
    const predictionsInt = this._model.predict(X);
    const predictions = predictionsInt.map(intLabel => this.intToLabel[intLabel]);
    return predictions;
  }

}

export default Model;
