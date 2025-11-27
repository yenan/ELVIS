import { useState, useEffect } from 'react';
import { create, all } from 'mathjs';

const math = create(all);

function useDerivatives(functionInput) {
  const [gradient, setGradient] = useState("");
  const [hessian, setHessian] = useState("");

  useEffect(() => {
    if (!functionInput || typeof functionInput !== 'string') {
      setGradient("");
      setHessian("");
      return;
    }

    try {
      const expr = math.parse(functionInput);
      const dx = math.derivative(expr, 'x').toString();
      const dy = math.derivative(expr, 'y').toString();

      const dxx = math.derivative(dx, 'x').toString();
      const dyy = math.derivative(dy, 'y').toString();
      const dxy = math.derivative(dx, 'y').toString();

      const gradientText = `[${dx}, ${dy}]`;
      const hessianText = `[[${dxx}, ${dxy}], [${dxy}, ${dyy}]]`;
      
      setGradient(gradientText);
      setHessian(hessianText);
    } catch (error) {
      setGradient("");
      setHessian("");
    }
  }, [functionInput]);

  return { gradient, hessian };
}

export default useDerivatives;
