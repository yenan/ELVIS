import { useState } from "react";
import Button from "../../../../components/Button/Button.jsx";
import "../../styles.css";


function ArchitectureEditor(props) {
  const [draft, setDraft] = useState(props.architecture);

  return (
    <div className="card">
      <div className="field">
        <label>Architecture Editor</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={20}
          style={{ height: "auto" }}
        />
      </div>
      <Button
        onClick={() => props.onChange(draft)}
      >
        Apply Changes
      </Button>
    </div>
  );
}

export default ArchitectureEditor;
