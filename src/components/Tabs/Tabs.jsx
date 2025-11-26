import { useState } from "react";
import "./Tabs.css";

function Tabs(props) {
  const [activeTab, setActiveTab] = useState(props.defaultTab);

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {props.tabs.map((tab) => (
          <button
            key={tab.label}
            className={activeTab === tab.label ? "active" : ""}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}


      </div>

      <div className="tab-content">
        {props.tabs.find((tab) => tab.label === activeTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;
