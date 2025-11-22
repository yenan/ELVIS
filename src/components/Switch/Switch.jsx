import "./Switch.css";

function Switch(props) {
  return (
    <div className="switch-container">
      <span className="switch-label">{props.leftLabel}</span>

      <label className="switch">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
        />
        <span className="slider" />
      </label>

      <span className="switch-label">{props.rightLabel}</span>
    </div>
  );
}

export default Switch;
