import { create, all, parse } from 'mathjs';

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
  gradient, 
  hessian,
  optimizer, 
  params, 
  stepCount
) { 
  // compile functions and derivatives
  let fn, gradientFn, hessianFn;
  try {
    fn = math.compile(func);
    gradientFn = parse(gradient).items.map(item => item.compile());
    hessianFn = parse(hessian).items.map(
      row => row.items.map(item => item.compile())
    );
  } catch {
    // invalid function
    return [];
  }

  const parsedParams = parseParams(params);
  if (!parsedParams) {
    return [];
  }

  if (optimizer == "gd") {
    return computeGdTrajectory(
      fn, 
      gradientFn, 
      parsedParams.learningRate, 
      parsedParams.momentum, 
      parsedParams.x0, 
      parsedParams.y0,
      stepCount
    );
  } else if (optimizer == "newton") {
    return computeNewtonTrajectory(
      fn, 
      gradientFn, 
      hessianFn, 
      parsedParams.x0, 
      parsedParams.y0,
      stepCount
    );
  } else if (optimizer == "adam") {
    return computeAdamTrajectory(
      fn, 
      gradientFn, 
      parsedParams.learningRate, 
      parsedParams.beta1,
      parsedParams.beta2,
      parsedParams.epsilon,
      parsedParams.x0, 
      parsedParams.y0,
      stepCount
    );
  } else {
    return [];
  }
}

function computeGdTrajectory(
  fn,
  gradientFn,
  learningRate,
  momentum,
  x0,
  y0,
  stepCount
) {
  const trajectory = [];
  let x = x0;
  let y = y0;

  for (let step = 0; step < stepCount + 1; ++step) {
    let z;
    try {
      z = fn.evaluate({ x, y });
    } catch {
      return [];
    }

    let dx, dy;
    try {
      dx = gradientFn[0].evaluate({ x, y });
      dy = gradientFn[1].evaluate({ x, y });
    } catch {
      return [];
    }
    const grad = [dx, dy];
    const gradNorm = math.norm(grad);

    trajectory.push({ x, y, z, gradNorm, step });

    let updateX = -learningRate * dx;
    let updateY = -learningRate * dy;

    if (step > 0) {
      updateX += momentum * (trajectory[step].x - trajectory[step - 1].x);
      updateY += momentum * (trajectory[step].y - trajectory[step - 1].y);
    }

    x += updateX;
    y += updateY;
  }

  return trajectory;
}


function computeAdamTrajectory(
  fn,
  gradientFn,
  learningRate,
  beta1,
  beta2,
  epsilon,
  x0,
  y0,
  stepCount
) {
  const trajectory = [];
  let x = x0;
  let y = y0;

  let mX = 0;
  let mY = 0;
  let vX = 0;
  let vY = 0;

  for (let step = 0; step < stepCount + 1; ++step) {
    let z;
    try {
      z = fn.evaluate({ x, y });
    } catch {
      return [];
    }

    let dx, dy;
    try {
      dx = gradientFn[0].evaluate({ x, y });
      dy = gradientFn[1].evaluate({ x, y });
    } catch {
      return [];
    }
    const grad = [dx, dy];
    const gradNorm = math.norm(grad);

    trajectory.push({ x, y, z, gradNorm, step });

    mX = beta1 * mX + (1 - beta1) * dx;
    mY = beta1 * mY + (1 - beta1) * dy;

    vX = beta2 * vX + (1 - beta2) * dx * dx;
    vY = beta2 * vY + (1 - beta2) * dy * dy;

    const mXHat = mX / (1 - Math.pow(beta1, step + 1));
    const mYHat = mY / (1 - Math.pow(beta1, step + 1));
    
    const vXHat = vX / (1 - Math.pow(beta2, step + 1));
    const vYHat = vY / (1 - Math.pow(beta2, step + 1));

    x -= (learningRate * mXHat) / (Math.sqrt(vXHat) + epsilon);
    y -= (learningRate * mYHat) / (Math.sqrt(vYHat) + epsilon);
  }

  return trajectory;
}


function computeNewtonTrajectory(
  fn,
  gradientFn,
  hessianFn,
  x0,
  y0,
  stepCount
) {
  const trajectory = [];
  let x = x0;
  let y = y0;

  for (let step = 0; step < stepCount + 1; ++step) {
    let z;
    try {
      z = fn.evaluate({ x, y });
    } catch {
      return [];
    }

    let dx, dy;
    try {
      dx = gradientFn[0].evaluate({ x, y });
      dy = gradientFn[1].evaluate({ x, y });
    } catch {
      return [];
    }
    const grad = [dx, dy];
    const gradNorm = math.norm(grad);

    trajectory.push({ x, y, z, gradNorm, step });

    let dxx, dyy, dxy;
    try {
      dxx = hessianFn[0][0].evaluate({ x, y });
      dxy = hessianFn[0][1].evaluate({ x, y });
      dyy = hessianFn[1][1].evaluate({ x, y });
    } catch {
      return [];
    }
    const hessian = math.matrix([[dxx, dxy], [dxy, dyy]]);

    let hessianInv;
    try {
      hessianInv = math.inv(hessian);
    } catch {
      break; // cannot proceed further
    }

    const update = math.multiply(hessianInv, grad);
    x -= update.subset(math.index(0));
    y -= update.subset(math.index(1));
  }
  
  return trajectory;
}

export default computeTrajectory;
