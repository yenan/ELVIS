import "./LayerViewer.css";

function MaxPoolLayerViewer(props) {

	function extractActivationMaps() {
		const [batchSize, H, W, C] = props.output.shape;
		const activations = props.output.dataSync();
		let minVal = Infinity;
		let maxVal = -Infinity;
		for (let i = 0; i < activations.length; ++i) {
			const val = activations[i];
			if (val < minVal) {
				minVal = val;
			}
			if (val > maxVal) {
				maxVal = val;
			}
		}

		let activationImgDatas = [];
		for (let c = 0; c < C; ++c) {
			const buffer = new Uint8ClampedArray(H * W * 4);

			for (let i = 0; i < H; ++i) {
				for (let j = 0; j < W; ++j) {
					const val = activations[
						0 * H * W * C +  // batch index 0
						i * W * C +
						j * C +
						c
					];
					const normVal = (val - minVal) / (maxVal - minVal + 1e-8);

					buffer[(i * W + j) * 4 + 0] = normVal * 255; // R
					buffer[(i * W + j) * 4 + 1] = normVal * 255; // G
					buffer[(i * W + j) * 4 + 2] = normVal * 255; // B
					buffer[(i * W + j) * 4 + 3] = 255;           // A
				}
			}

			const imgData = new ImageData(buffer, W, H);
			activationImgDatas.push(imgData);
		}

		return activationImgDatas;
	}

	function imgDataToSrc(imgData) {
		const canvas = document.createElement('canvas');
		canvas.width = imgData.width;
		canvas.height = imgData.height;
		const ctx = canvas.getContext('2d');
		ctx.putImageData(imgData, 0, 0);
		return canvas.toDataURL();
	}

	const activations = extractActivationMaps();
	const activationSrcs = activations.map(imgDataToSrc);

	return (
		<div className="layer-viewer">
		  <h3 className="layer-header">MaxPool Layer</h3>

      <div className="layer-details">
        <div><strong>Pool Size:</strong> {props.size}x{props.size}</div>
        <div><strong>Stride:</strong> {props.stride}</div>
      </div>

      <h4>Outputs</h4>
      <div className="layer-grid">
				{activationSrcs.map((src, idx) => (
					<img 
						key={idx} 
						src={src} 
						alt={`Output ${idx}`} 
					/>
				))}
      </div>
    </div>
	);
}

export default MaxPoolLayerViewer;
