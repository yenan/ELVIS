import { useRef, useState } from "react";


const DEFAULT_EMBEDDER_OPTIONS = {
  CoordinateProjection: {dim1: 0, dim2: 1},
  PCA: {},
};


function handleFileSelect(e, setSelectedFile) {
  const file = e.target.files[0];
  setSelectedFile(file);
}

function handleLoadData(selectedFile, embedderType, onFileUpload) {
  if (selectedFile) {
    onFileUpload(selectedFile, embedderType);
  } else {
    alert("Please select a file first.");
  }
}

function UploadDataOptions(props) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [embedderType, setEmbedderType] = useState("CoordinateProjection");
  const [embedderOptions, setEmbedderOptions] = useState(
    DEFAULT_EMBEDDER_OPTIONS[embedderType]
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e, setSelectedFile)}
      />

      <button 
        onClick={() => fileInputRef.current.click()}
      >
        Upload CSV
      </button>
      {selectedFile && (
        <>
          
          <div className="field">
            <label>Selected file</label>
            <input type="text" value={selectedFile.name} readOnly />
          </div>

          <div className="field">
            <label>Embedder Type</label>
            <select
              value={embedderType}
              onChange={(e) => {
                setEmbedderType(e.target.value);
                setEmbedderOptions(DEFAULT_EMBEDDER_OPTIONS[e.target.value]);
              }}
            >
              {Object.keys(DEFAULT_EMBEDDER_OPTIONS).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {Object.entries(embedderOptions).map(([param, value]) => (
            <div className="field" key={param}>
              <label className="label">{param}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setEmbedderOptions({
                  ...embedderOptions, 
                  [param]: e.target.value
                })}
              />
            </div>
          ))}

          <button onClick={handleLoadData}>
            Load Data
          </button>
        </>
      )}
    </>
  );
}

export default UploadDataOptions;
