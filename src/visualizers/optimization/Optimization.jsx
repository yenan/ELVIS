import './Optimization.css'
import Tabs from "../../components/Tabs/Tabs.jsx"
import UnivariatePage from "./univariate/UnivariatePage.jsx"


function Optimization() {
	const tabData = [
	  {
			label: "Univariate",
			content: <UnivariatePage />,
	  },
		{
			label: "Bivariate",
      // content: <Bivariate />,
      content: <div>Bivariate Visualizer Placeholder</div>,
		},
	];

  return (
    <>
      <h1>Optimization Visualizer</h1>
			<Tabs
				defaultTab="Univariate"
				tabs={tabData}
			/>
    </>
  )
}

export default Optimization;
