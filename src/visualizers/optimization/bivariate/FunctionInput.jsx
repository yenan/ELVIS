import "../styles.css";

function FunctionInput(props) {
  return (
    <div className="field">
      <label htmlFor="function-input">Function (in terms of x and y)</label>
      <input
        id="function-input"
        type="text"
        value={props.functionInput}
        onChange={(e) => props.setFunctionInput(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}

export default FunctionInput;
