import "../styles.css";

function getContentHeight(element) {
  const style = window.getComputedStyle(element);
  const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  return element.scrollHeight - padding;
}

function DerivativesDisplay(props) {
  return (
    <>
      <div className="field">
        <label>First Derivative</label>
        <textarea
          type="text"
          value={props.derivative}
          readOnly
          onFocus={(e) => {
            e.target.style.height = "1.5em";
            e.target.style.height = getContentHeight(e.target) + "px";
          }}
          onBlur={(e) => {
            e.target.style.height = "1.5em";
          }}
        />
      </div>
      {props.showSecondDerivative && (
        <div className="field">
          <label>Second Derivative</label>
          <textarea
            type="text"
            value={props.secondDerivative}
            readOnly
            onFocus={(e) => {
              e.target.style.height = "1.5em";
              e.target.style.height = getContentHeight(e.target) + "px";
            }}
            onBlur={(e) => {
              e.target.style.height = "1.5em";
            }}
          />
        </div>
      )}
    </>
  );
}

export default DerivativesDisplay;
