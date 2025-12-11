import { useRef } from "react";
import "./styles.css";

function DataTab(props) {
  const fileInputRef = useRef(null);

  return (
    <div className="card">
      <div className="field">
        <label>Data Source</label>
        <select
          value={props.dataSource}
          onChange={(e) => props.setDataSource(e.target.value)}
        >
          <option value="manual">Manual Edit</option>
          <option value="upload">Upload CSV</option>
        </select>
      </div>
      { props.dataSource === "manual" && (
        <>
          <div className="field">
            <label>Point label</label>
            <select
              value={props.pointLabel}
              onChange={(e) => props.setPointLabel(e.target.value)}
            >
              {props.pallette.map((color) => (
                <option key={color.name} value={color.name}>{color.name}</option>
              ))}
            </select>
          </div>
          <div className="button">
            <button onClick={() => props.downloadCsv()}>Download CSV</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => props.loadCsv(e.target.files[0])}
          />
          <div className="button">
            <button onClick={() => fileInputRef.current.click()}>Load CSV</button>
          </div>
          <div className="button">
            <button onClick={() => props.clearData()}>Clear</button>
          </div>
        </>
      )}
    </div>
  );
}

export default DataTab;
