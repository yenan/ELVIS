import { create, all } from 'mathjs';

const math = create(all);

function computeTrajectory(
  func, 
  derivative, 
  secondDerivative, 
  optimizer, 
  params, 
  stepCount
) { 
  const fn = math.compile(func);
  const d1 = math.compile(derivative);
  const d2 = secondDerivative ? math.compile(secondDerivative) : null;

  if (optimizer == "gd") {
    return computeGdTrajectory(fn, d1, params.learningRate, params.momentum, params.x0, stepCount);
  } else if (optimizer == "newton") {
    return computeNewtonTrajectory(fn, d1, d2, params.x0, stepCount);
  } else {
    return [];
  }
}

function computeGdTrajectory(fn, d1, learningRate, momentum, x0, stepCount) {
  const trajectory = [];
  let x = x0;

  for (let step = 0; step < stepCount + 1; ++step) {
    const y = fn.evaluate({ x });
    trajectory.push({ x, y, step });

    const grad = d1.evaluate({ x });
    let update = -learningRate * grad;
    if (step > 0) {
      update += momentum * (trajectory[step].x - trajectory[step - 1].x);
    }
    x += update;
  }

  return trajectory;
}

function computeNewtonTrajectory(fn, d1, d2, x0, stepCount) {
  const trajectory = [];
  let x = x0;

  for (let step = 0; step < stepCount + 1; ++step) {
    const y = fn.evaluate({ x });
    trajectory.push({ x, y, step });

    const grad = d1.evaluate({ x });
    const grad2 = d2.evaluate({ x });
    if (grad2 === 0) {
      break; // Avoid division by zero
    }
    const update = -grad / grad2;
    x += update;
  }
  
  return trajectory;
}

export default computeTrajectory;
