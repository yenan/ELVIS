import "../styles.css";

function DerivativesDisplay(props) {
  return (
    <>
      <div className="field">
        <label>First Derivative</label>
        <input
          type="text"
          value={props.derivative}
          readOnly
        />
      </div>
      {props.showSecondDerivative && (
        <div className="field">
          <label>Second Derivative</label>
          <input
            type="text"
            value={props.secondDerivative}
            readOnly
          />
        </div>
      )}
    </>
  );
}

export default DerivativesDisplay;
