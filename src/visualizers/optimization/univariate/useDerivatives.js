import { useState, useEffect } from 'react';
import { create, all } from 'mathjs';

const math = create(all);

function useDerivatives(functionInput) {
  const [derivative, setDerivative] = useState("");
  const [secondDerivative, setSecondDerivative] = useState("");

  useEffect(() => {
    if (!functionInput || typeof functionInput !== 'string') {
      setDerivative("");
      setSecondDerivative("");
      return;
    }

    try {
      const expr = math.parse(functionInput);
      const firstDeriv = math.derivative(expr, 'x').toString();
      const secondDeriv = math.derivative(firstDeriv, 'x').toString();
      setDerivative(firstDeriv);
      setSecondDerivative(secondDeriv);
    } catch (error) {
      setDerivative("");
      setSecondDerivative("");
    }
  }, [functionInput]);

  return { derivative, secondDerivative };
}

export default useDerivatives;
