import './Cnn.css'
import ConvolutionVisualizer from "./components/convolution/ConvolutionVisualizer.jsx"
import NetworkVisualizer from "./components/network/NetworkVisualizer.jsx"
// import MnistTrainer from "./components/cnn/MnistTrainer.jsx"
import Tabs from "../../components/Tabs/Tabs.jsx"


function App() {
	const tabData = [
	  {
			label: "Convolution",
			content: <ConvolutionVisualizer />,
	  },
		{
			label: "Network",
			content: <NetworkVisualizer />,
		},
	];

  return (
    <>
      <h1>CNN Visualizer</h1>
			<Tabs
				defaultTab="Convolution"
				tabs={tabData}
			/>
    </>
  )
}

export default App;
