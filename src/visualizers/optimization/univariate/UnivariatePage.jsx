import { useState, useEffect } from "react";
import { create, all } from "mathjs";
import OptimizationPlot from "./OptimizationPlot.jsx";
import Sidebar from "./Sidebar.jsx";
import useDerivatives from "./useDerivatives.js";
import useShowSecondDerivative from "./useShowSecondDerivative.js";
import useTrajectory from "./useTrajectory.js";
import "./UnivariatePage.css";

const math = create(all);


function updateFunctionInput(
  draftFunctionInput, setFunctionInput
) {
  try {
    math.parse(draftFunctionInput);
    setFunctionInput(draftFunctionInput);
  } catch (error) {
    // Invalid function input; do not update
  }
}


function UnivariatePage() {
  const [draftFunctionInput, setDraftFunctionInput] = useState("x ^ 2");
  const [functionInput, setFunctionInput] = useState("x ^ 2");
  const { derivative, secondDerivative } = useDerivatives(functionInput);

  useEffect(() => {
    updateFunctionInput(draftFunctionInput, setFunctionInput);
  }, [draftFunctionInput]);

  const [optimizer, setOptimizer] = useState("gd");
  const [optimizerParams, setOptimizerParams] = useState({ 
    learningRate: 0.1, 
    momentum: 0.0,
    x0: 0.5
  });
  const showSecondDerivative = useShowSecondDerivative(optimizer);

  const [stepCount, setStepCount] = useState(0);
  const trajectory = useTrajectory(
    functionInput,
    derivative,
    secondDerivative,
    optimizer,
    optimizerParams,
    stepCount
  );

  useEffect(() => {
    setStepCount(0);
  }, [functionInput, derivative, secondDerivative, optimizer, optimizerParams]);

  return (
    <div className="univariate-visualizer">
      <OptimizationPlot 
        functionInput={functionInput} 
        trajectory={trajectory}
      />
      <Sidebar 
        draftFunctionInput={draftFunctionInput} 
        setDraftFunctionInput={setDraftFunctionInput} 
        derivative={derivative} 
        secondDerivative={secondDerivative}
        showSecondDerivative={showSecondDerivative}

        optimizer={optimizer}
        setOptimizer={setOptimizer}
        optimizerParams={optimizerParams}
        setOptimizerParams={setOptimizerParams}

        stepCount={stepCount}
        setStepCount={setStepCount}
      />
    </div>
  )
}

export default UnivariatePage;
