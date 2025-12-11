import DataTab from "./DataTab.jsx";
import Tabs from "../../components/Tabs/Tabs.jsx";

function Sidebar(props) {
  const tabData = [
    {
      label: "Data",
      content: (
        <DataTab 
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          pointLabel={props.pointLabel}
          setPointLabel={props.setPointLabel}
          pallette={props.pallette}
          downloadCsv={props.downloadCsv}
          loadCsv={props.loadCsv}
          clearData={props.clearData}
        />
      ),
    },
    {
      label: "Model",
      content: <div>Model Tab Content</div>,
    },
  ];

  return (
    <div className="sidebar">
      <Tabs tabs={tabData} defaultTab={"Data"}/>
    </div>
  );
}
    
export default Sidebar;
