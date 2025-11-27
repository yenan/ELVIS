import Conv2dLayerViewer from "./Conv2dLayerViewer.jsx";
import MaxPoolLayerViewer from "./MaxPoolLayerViewer.jsx";
import InputViewer from "./InputViewer.jsx";
import OutputLayerViewer from "./OutputLayerViewer.jsx";

function InfoViewer(props) {
	function renderLayer(layer, idx) {
		switch (layer.type) {
			case 'input':
				return (
					<InputViewer
						key={idx}
					  output={layer.output}
						shape={layer.shape}
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
						kernels={layer.kernels} 
					  output={layer.output}
						kernelShape={layer.kernelShape}
						outputShape={layer.outputShape}
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
						shape={layer.shape}
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
		  {props.info && props.info.slice(0, -1).map((layer, idx) => (
				renderLayer(layer, idx)
			))}
      {props.info && props.info.length > 0 && (
        <OutputLayerViewer
          probs={props.info[props.info.length - 1]?.output}
          tick={props.tick}
        />
      )
      }
		</div>
	);
}

export default InfoViewer;
