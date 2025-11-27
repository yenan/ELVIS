import { useEffect, useState } from "react";

function useShowSecondDerivative(optimizer) {
  const [showSecondDerivative, setShowSecondDerivative] = useState(false);

  useEffect(() => {
    setShowSecondDerivative(optimizer === "newton");
  }, [optimizer]);

  return showSecondDerivative;
}

export default useShowSecondDerivative;
