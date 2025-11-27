import './Optimization.css'
import Tabs from "../../components/Tabs/Tabs.jsx"
import UnivariatePage from "./univariate/UnivariatePage.jsx"
import BivariatePage from "./bivariate/BivariatePage.jsx"


function Optimization() {
	const tabData = [
	  {
			label: "Univariate",
			content: <UnivariatePage />,
	  },
		{
			label: "Bivariate",
      content: <BivariatePage />,
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
