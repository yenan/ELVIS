import { useState, useEffect } from "react";
import computeTrajectory from "./computeTrajectory.js";

function useTrajectory(
  functionInput,
  derivative,
  secondDerivative,
  optimizer,
  optimizerParams,
  stepCount
) {
  const [trajectory, setTrajectory] = useState([]);

  useEffect(() => {
    const traj = computeTrajectory(
      functionInput,
      derivative,
      secondDerivative,
      optimizer,
      optimizerParams,
      stepCount
    );
    setTrajectory(traj);
  }, [
    functionInput,
    derivative,
    secondDerivative,
    optimizer,
    optimizerParams,
    stepCount
  ]);

  return trajectory;
}

export default useTrajectory;
