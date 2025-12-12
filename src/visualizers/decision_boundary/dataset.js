class Dataset {
    constructor(
      dataForTrain = { features: [], labels: [] },
      dataForVis = {},
      embeder_options = null,
      preprocess_options = null
    ) {
      this.embeder_options = null;
      this.preprocess_options = null;

      // deep copy train data
      this._data_for_train = {
        features: dataForTrain.features.map(point => [...point]),
        labels: [...dataForTrain.labels],
      };

      // deep copy vis data
      this._data_for_vis = {};
      for (const label in dataForVis) {
        this._data_for_vis[label] = {
          x: [...dataForVis[label].x],
          y: [...dataForVis[label].y],
        };
      }

    }

    getDataForTrain() {
      return this._data_for_train;
    }

    getDataForVis() {
      return this._data_for_vis;
    }

    getNumClasses() {
      return Object.keys(this._data_for_vis).length;
    }

    addDataPoint(point, label) {
      // deep copy train data and add new point
      const newTrain = {
        features: [...this._data_for_train.features, [...point]],
        labels: [...this._data_for_train.labels, label],
      };

      // deep copy vis data
      const newVis = {};
      for (const key in this._data_for_vis) {
        newVis[key] = {
          x: [...this._data_for_vis[key].x],
          y: [...this._data_for_vis[key].y],
        };
      }

      // add new point to vis data
      if (!newVis[label]) {
        newVis[label] = { x: [], y: [] };
      }
      newVis[label].x.push(point[0]);
      newVis[label].y.push(point[1]);

      return new Dataset(
        newTrain, 
        newVis,
        this.embeder_options,
        this.preprocess_options,
      );

    }

    clearData() {
      return new Dataset(
        { features: [], labels: [] },
        {},
        this.embeder_options,
        this.preprocess_options,
      );
    }
}

export { Dataset };

