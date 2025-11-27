import Button from '../../../components/Button/Button.jsx';
import "../styles.css";

function handleRandomInit(
  params, setParams, xMin, xMax, yMin, yMax
) {
  xMin = parseFloat(xMin);
  xMax = parseFloat(xMax);
  yMin = parseFloat(yMin);
  yMax = parseFloat(yMax);
  if (
    isNaN(xMin) || isNaN(xMax) || xMin >= xMax ||
    isNaN(yMin) || isNaN(yMax) || yMin >= yMax
  ) {
    return;
  }

  const randomX0 = Math.random() * (xMax - xMin) + xMin
  const randomY0 = Math.random() * (yMax - yMin) + yMin
  setParams({
    ...params,
    x0: randomX0,
    y0: randomY0,
  });
}

function InitialPointInput(props) {
  return (
    <>
      <div className="double-field">
        <div className="field">
          <label htmlFor="initial-x-input">Initial x</label>
          <input
            id="initial-x-input"
            type="text"
            value={props.params.x0}
            onChange={(e) => {
              props.setParams({
                ...props.params,
                x0: e.target.value,
              });
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="initial-y-input">Initial y</label>
          <input
            id="initial-y-input"
            type="text"
            value={props.params.y0}
            onChange={(e) => {
              props.setParams({
                ...props.params,
                y0: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <Button 
        onClick={() =>
          handleRandomInit(
            props.params,
            props.setParams,
            props.xMin,
            props.xMax,
            props.yMin,
            props.yMax
          )
        }
      >
        Random Initial Point
      </Button>
    </>
  );
}

export default InitialPointInput;
