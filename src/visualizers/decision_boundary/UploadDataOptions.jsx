import { useRef } from "react";

function UploadDataOptions(props) {
  const fileInputRef = useRef(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
      />
      <button 
        onClick={() => fileInputRef.current.click()}
      >
        Upload CSV
      </button>
    </>
  );
}

export default UploadDataOptions;
