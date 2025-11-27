import { useState, useEffect } from "react";
import { create, all } from "mathjs";
import OptimizationPlot from "./OptimizationPlot.jsx";
import Sidebar from "./Sidebar.jsx";
import useDerivatives from "./useDerivatives.js";
import useShowSecondDerivative from "./useShowSecondDerivative.js";
import useTrajectory from "./useTrajectory.js";
import "./UnivariatePage.css";

const math = create(all);


function UnivariatePage() {
  const [functionInput, setFunctionInput] = useState("x ^ 2");
  const { derivative, secondDerivative } = useDerivatives(functionInput);
  const [functionXMin, setFunctionXMin] = useState("-1");
  const [functionXMax, setFunctionXMax] = useState("1");

  const [optimizer, setOptimizer] = useState("gd");
  const [optimizerParams, setOptimizerParams] = useState({ 
    learningRate: "0.1", 
    momentum: "0.0",
    x0: "0.5"
  });
  // const showSecondDerivative = useShowSecondDerivative(optimizer);

  const [stepCount, setStepCount] = useState(0);
  const trajectory = useTrajectory(
    functionInput,
    derivative,
    secondDerivative,
    optimizer,
    optimizerParams,
    stepCount
  );
  const currentPoint = trajectory.length > 0 
    ? trajectory[trajectory.length - 1] 
    : null;

  useEffect(() => {
    setStepCount(0);
  }, [functionInput, derivative, secondDerivative, optimizer, optimizerParams]);

  return (
    <div className="univariate-visualizer">
      <OptimizationPlot 
        functionInput={functionInput} 
        trajectory={trajectory}
        functionXMin={functionXMin}
        functionXMax={functionXMax}
      />
      <Sidebar 
        functionInput={functionInput} 
        setFunctionInput={setFunctionInput} 
        derivative={derivative} 
        secondDerivative={secondDerivative}
        showSecondDerivative={true}
        functionXMin={functionXMin}
        setFunctionXMin={setFunctionXMin}
        functionXMax={functionXMax}
        setFunctionXMax={setFunctionXMax}

        optimizer={optimizer}
        setOptimizer={setOptimizer}
        optimizerParams={optimizerParams}
        setOptimizerParams={setOptimizerParams}

        stepCount={stepCount}
        setStepCount={setStepCount}
        currentY={currentPoint ? currentPoint.y : null}
        currentDerivative={currentPoint ? currentPoint.grad : null}
      />
    </div>
  )
}

export default UnivariatePage;
