import Conv2dLayerViewer from "./Conv2dLayerViewer.jsx";
import MaxPoolLayerViewer from "./MaxPoolLayerViewer.jsx";
import InputViewer from "./InputViewer.jsx";

function InfoViewer(props) {
	function renderLayer(layer, idx) {
		switch (layer.type) {
			case 'input':
				return (
					<InputViewer
						key={idx}
					  output={layer.output}
            onSampleIndexChange={props.onSampleIndexChange}
            tick={props.tick}
					/>
				);
			case 'conv2d':
				return (
					<Conv2dLayerViewer 
            key={idx}
						layerIdx={idx} 
						stride={layer.stride} 
						padding={layer.padding} 
						activationType={layer.activationType}
						weights={layer.weights} 
					  output={layer.output}
					  type={layer.type}
            tick={props.tick}
					/>
				);
			case 'maxpool':
				return (
					<MaxPoolLayerViewer 
            key={idx}
						stride={layer.stride} 
						size={layer.size}
					  output={layer.output}
            tick={props.tick}
					/>
				);
			case 'flatten':
				return;
			case 'dense':
				return <p key={idx}>Dense Layer: {layer.details}</p>;
			default:
				return <p key={idx}>Unknown Layer Type</p>;
		}
	}

	return (
		<div>
		  {props.info && props.info.map((layer, idx) => (
				renderLayer(layer, idx)
			))}
		</div>
	);
}

export default InfoViewer;
