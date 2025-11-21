import './Cnn.css'
import ConvolutionVisualizer from "./components/convolution/ConvolutionVisualizer.jsx"
import MnistTrainer from "./components/cnn/MnistTrainer.jsx"
import Tabs from "./components/utils/Tabs.jsx"


function App() {
	const tabData = [
	  {
			label: "Convolution",
			content: <ConvolutionVisualizer />,
	  },
		{
			label: "CNN",
			content: <MnistTrainer />,
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
