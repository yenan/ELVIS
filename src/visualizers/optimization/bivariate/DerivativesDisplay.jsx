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
        <label>Gradient</label>
        <textarea
          type="text"
          value={props.gradient}
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
      <div className="field">
        <label>Hessian</label>
        <textarea
          type="text"
          value={props.hessian}
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
    </>
  );
}

export default DerivativesDisplay;
