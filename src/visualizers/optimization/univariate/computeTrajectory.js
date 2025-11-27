import { create, all } from 'mathjs';

const math = create(all);


function parseParams(params) {
  const parsed = {};
  for (const key in params) {
    const value = parseFloat(params[key]);
    if (isNaN(value)) {
      return null;
    }
    parsed[key] = value;
  }
  return parsed;
}


function computeTrajectory(
  func, 
  derivative, 
  secondDerivative, 
  optimizer, 
  params, 
  stepCount
) { 

  // compile functions and derivatives
  let fn, d1, d2;
  try {
    fn = math.compile(func);
    d1 = math.compile(derivative);
    d2 = secondDerivative ? math.compile(secondDerivative) : null;
  } catch {
    // invalid function
    return [];
  }

  const parsedParams = parseParams(params);
  if (!parsedParams) {
    return [];
  }

  if (optimizer == "gd") {
    return computeGdTrajectory(fn, d1, parsedParams.learningRate, parsedParams.momentum, parsedParams.x0, stepCount);
  } else if (optimizer == "newton") {
    return computeNewtonTrajectory(fn, d1, d2, parsedParams.x0, stepCount);
  } else {
    return [];
  }
}

function computeGdTrajectory(fn, d1, learningRate, momentum, x0, stepCount) {
  const trajectory = [];
  let x = x0;

  for (let step = 0; step < stepCount + 1; ++step) {
    let y;
    try {
      y = fn.evaluate({ x });
    } catch {
      return [];
    }

    let grad;
    try {
      grad = d1.evaluate({ x });
    } catch {
      return [];
    }

    trajectory.push({ x, y, grad, step });

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
    let y;
    try {
      y = fn.evaluate({ x });
    } catch {
      return [];
    }

    let grad, grad2;
    try {
      grad = d1.evaluate({ x });
      grad2 = d2.evaluate({ x });
    } catch {
      return [];
    }

    trajectory.push({ x, y, grad, step });

    if (grad2 === 0) {
      break; // cannot proceed further
    }

    const update = -grad / grad2;
    x += update;
  }
  
  return trajectory;
}

export default computeTrajectory;
