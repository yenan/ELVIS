import { useState, useEffect } from "react";
import { create, all } from "mathjs";
import OptimizationPlot from "./OptimizationPlot.jsx";
import Sidebar from "./Sidebar.jsx";
import useDerivatives from "./useDerivatives.js";
import useTrajectory from "./useTrajectory.js";
import "./BivariatePage.css";

const math = create(all);


function BivariatePage() {
  const [functionInput, setFunctionInput] = useState("x ^ 2 + 3 * y ^ 2");
  const { gradient, hessian } = useDerivatives(functionInput);
  const [functionXMin, setFunctionXMin] = useState("-1");
  const [functionXMax, setFunctionXMax] = useState("1");
  const [functionYMin, setFunctionYMin] = useState("-1");
  const [functionYMax, setFunctionYMax] = useState("1");

  const [optimizer, setOptimizer] = useState("gd");
  const [optimizerParams, setOptimizerParams] = useState({ 
    learningRate: "0.1", 
    momentum: "0.0",
    x0: "0.5",
    y0: "0.5"
  });

  const [stepCount, setStepCount] = useState(0);
  const trajectory = useTrajectory(
    functionInput,
    gradient,
    hessian,
    optimizer,
    optimizerParams,
    stepCount
  );
  const currentPoint = trajectory.length > 0 
    ? trajectory[trajectory.length - 1] 
    : null;

  useEffect(() => {
    setStepCount(0);
  }, [functionInput, gradient, hessian, optimizer, optimizerParams]);

  return (
    <div className="bivariate-visualizer">
      <OptimizationPlot 
        functionInput={functionInput} 
        trajectory={trajectory}
        functionXMin={functionXMin}
        functionXMax={functionXMax}
        functionYMin={functionYMin}
        functionYMax={functionYMax}
      />
      <Sidebar 
        functionInput={functionInput} 
        setFunctionInput={setFunctionInput} 
        gradient={gradient} 
        hessian={hessian}

        functionXMin={functionXMin}
        setFunctionXMin={setFunctionXMin}
        functionXMax={functionXMax}
        setFunctionXMax={setFunctionXMax}
        functionYMin={functionYMin}
        setFunctionYMin={setFunctionYMin}
        functionYMax={functionYMax}
        setFunctionYMax={setFunctionYMax}

        optimizer={optimizer}
        setOptimizer={setOptimizer}
        optimizerParams={optimizerParams}
        setOptimizerParams={setOptimizerParams}

        stepCount={stepCount}
        setStepCount={setStepCount}
        currentZ={currentPoint ? currentPoint.z : null}
        currentGradNorm={currentPoint ? currentPoint.gradNorm : null}
      />
    </div>
  )
}

export default BivariatePage;
