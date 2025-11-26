import { Routes, Route } from "react-router-dom";
import "./App.css";

import Cnn from "./visualizers/cnn/Cnn.jsx";
import Optimization from "./visualizers/optimization/Optimization.jsx";
import VisualizerSelector from "./VisualizerSelector.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<VisualizerSelector />} />
      <Route path="/cnn" element={<Cnn />} />
      <Route path="/optimization" element={<Optimization />} />
    </Routes>
  );
}

export default App
