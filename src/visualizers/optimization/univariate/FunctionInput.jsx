import { useEffect, useRef } from "react";
import "../styles.css";

function getContentHeight(element) {
  const style = window.getComputedStyle(element);
  const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  return element.scrollHeight - padding;
}

function FunctionInput(props) {

  // auto-resize textarea based on functionInput size
  const functionInputRef = useRef(null);
  useEffect(() => {
    if (!functionInputRef.current) return;
    
    functionInputRef.current.style.height = "1.5em";
    functionInputRef.current.style.height = getContentHeight(functionInputRef.current) + "px";
  }, [props.functionInput]);

  return (
    <div className="field">
      <label htmlFor="function-input">Function (in terms of x)</label>
      <textarea
        id="function-input"
        ref={functionInputRef}
        type="text"
        value={props.functionInput}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/\n/g, "");
          props.setFunctionInput(e.target.value);
        }}
        autoComplete="off"
      />
    </div>
  );
}

export default FunctionInput;
