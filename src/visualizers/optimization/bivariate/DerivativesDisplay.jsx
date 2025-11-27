import "../styles.css";

function DerivativesDisplay(props) {
  return (
    <>
      <div className="field">
        <label>Gradient</label>
        <input
          type="text"
          value={props.gradient}
          readOnly
        />
      </div>
      <div className="field">
        <label>Hessian</label>
        <input
          type="text"
          value={props.hessian}
          readOnly
        />
      </div>
    </>
  );
}

export default DerivativesDisplay;
