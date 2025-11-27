import { useState, useEffect } from "react";
import computeTrajectory from "./computeTrajectory.js";

function useTrajectory(
  functionInput,
  gradient,
  hessian,
  optimizer,
  optimizerParams,
  stepCount
) {
  const [trajectory, setTrajectory] = useState([]);

  useEffect(() => {
    const traj = computeTrajectory(
      functionInput,
      gradient,
      hessian,
      optimizer,
      optimizerParams,
      stepCount
    );
    setTrajectory(traj);
  }, [
    functionInput,
    gradient,
    hessian,
    optimizer,
    optimizerParams,
    stepCount
  ]);

  return trajectory;
}

export default useTrajectory;
