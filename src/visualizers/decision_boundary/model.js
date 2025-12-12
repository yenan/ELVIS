import { Matrix } from 'ml-matrix';
import LogisticRegression from 'ml-logistic-regression';
import KNN from 'ml-knn';
import { DecisionTreeClassifier } from 'ml-cart';


const DEFAULT_HYPERPARAMETERS = {
  KNN: { k: "3" },
  LogisticRegression: { numSteps: "50000", learningRate: "0.0005" },
  DecisionTree: { gainFunction: "gini", maxDepth: "10", minNumSamples: "3" }
};


function getModel(modelType, hyperparameters) {
  if (modelType === "KNN") {
    return new KnnModel(hyperparameters);
  } else if (modelType === "LogisticRegression") {
    return new LogisticRegressionModel(hyperparameters);
  } else if (modelType === "DecisionTree") {
    return new DecisionTreeModel(hyperparameters);
  } else {
    throw new Error(`Unsupported model type: ${modelType}`);
  }
}


class BaseModel {
  constructor(hyperparameters) {
    this.labelToInt = {};
    this.intToLabel = {};
    this.hyperparameters = hyperparameters;
  }

  train(X, y) {
    throw new Error("train() method must be implemented by subclasses.");
  }

  predict(X) {
    throw new Error("predict() method must be implemented by subclasses.");
  }

  _buildLabelMappings(y) {
    const uniqueLabels = Array.from(new Set(y));

    uniqueLabels.forEach((label, index) => {
      this.labelToInt[label] = index;
      this.intToLabel[index] = label;
    });
  }
}

class KnnModel extends BaseModel {
  constructor(hyperparameters) {
    super(hyperparameters);
    this._processHyperparameters();
    this._model = null;
  }

  _processHyperparameters() {
    this.hyperparameters.k = parseInt(this.hyperparameters.k) || 3;
  }

  train(X, y) {
    this._buildLabelMappings(y);
    let yInt = y.map(label => this.labelToInt[label]);
    this._model = new KNN(X, yInt, this.hyperparameters);
  }

  predict(X) {
    if (!this._model) {
      console.error("Model has not been trained yet.");
      return null;
    }

    const predictionsInt = this._model.predict(X);
    const predictions = predictionsInt.map(intLabel => this.intToLabel[intLabel]);
    return predictions;
  }
}


class LogisticRegressionModel extends BaseModel {
  constructor(hyperparameters) {
    super(hyperparameters);
    this._processHyperparameters();
    this._model = new LogisticRegression(hyperparameters);
  }

  _processHyperparameters() {
    this.hyperparameters.numSteps = parseInt(this.hyperparameters.numSteps) || 50000;
    this.hyperparameters.learningRate = parseFloat(this.hyperparameters.learningRate) || 5e-4;
  }

  train(X, y) {
    this._buildLabelMappings(y);

    let yInt = y.map(label => this.labelToInt[label]);
    X = new Matrix(X);
    yInt = Matrix.columnVector(yInt);

    this._model.train(X, yInt);
  }

  predict(X) {
    if (!this._model) {
      console.error("Model has not been trained yet.");
      return null;
    }

    X = new Matrix(X);
    const predictionsInt = this._model.predict(X);
    const predictions = predictionsInt.map(intLabel => this.intToLabel[intLabel]);
    return predictions;
  }

}


class DecisionTreeModel extends BaseModel {
  constructor(hyperparameters) {
    super(hyperparameters);
    this._model = new DecisionTreeClassifier(hyperparameters);
  }

  train(X, y) {
    this._buildLabelMappings(y);
    let yInt = y.map(label => this.labelToInt[label]);
    this._model.train(X, yInt);
  }

  predict(X) {
    if (!this._model) {
      console.error("Model has not been trained yet.");
      return null;
    }

    const predictionsInt = this._model.predict(X);
    const predictions = predictionsInt.map(intLabel => this.intToLabel[intLabel]);
    return predictions;
  }
}


export { getModel, DEFAULT_HYPERPARAMETERS };
