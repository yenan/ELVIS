import "./LayerViewer.css";

function Conv2dLayerViewer(props) {
	const selectedOutputChannel = 0;

  const [kh, kw, inC, outC] = props.weights.shape; // [kernelH, kernelW, inChannels, outChannels]
  const [batch, H, W, C] = props.output.shape;     // output shape [1, H, W, outChannels]

	function extractKernels() {
		const kernels = props.weights.dataSync();
		let minVal = Infinity;
		let maxVal = -Infinity;
		for (let i = 0; i < kernels.length; ++i) {
			const val = kernels[i];
			if (val < minVal) {
				minVal = val;
			}
			if (val > maxVal) {
				maxVal = val;
			}
		}

		let kernelImgDatas = [];
		for (let ic = 0; ic < inC; ++ic) {
			const buffer = new Uint8ClampedArray(kh * kw * 4);

			for (let i = 0; i < kh; ++i) {
				for (let j = 0; j < kw; ++j) {
					const val = kernels[
						i * kw * inC * outC +
						j * inC * outC +
						ic * outC +
						selectedOutputChannel
					];
					const normVal = (val - minVal) / (maxVal - minVal + 1e-8);

					buffer[(i * kw + j) * 4 + 0] = normVal * 255; // R
					buffer[(i * kw + j) * 4 + 1] = normVal * 255; // G
					buffer[(i * kw + j) * 4 + 2] = normVal * 255; // B
					buffer[(i * kw + j) * 4 + 3] = 255;           // A
				}
			}

			const imgData = new ImageData(buffer, kw, kh);
			kernelImgDatas.push(imgData);
		}

		return kernelImgDatas;
	}

	function extractActivationMaps() {
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

	const kernels = extractKernels();
	const kernelSrcs = kernels.map(imgDataToSrc);
	const activations = extractActivationMaps();
	const activationSrcs = activations.map(imgDataToSrc);

  return (
    <div className="layer-viewer">
      <h3 className="layer-title">Convolution Layer</h3>

      <div className="layer-details">
        <div><strong>Kernel Size:</strong> {kh} × {kw}</div>
        <div><strong>Stride:</strong> {props.stride}</div>
        <div><strong>Padding:</strong> {props.padding}</div>
        <div><strong>Activation:</strong> {props.activationType}</div>
        <div><strong>Output channels:</strong> {C}</div>
      </div>

      <h4>Kernels</h4>
      <div className="layer-grid">
				{kernelSrcs.map((src, idx) => (
					<img 
						key={idx} 
						src={src} 
						alt={`Kernel ${idx}`} 
					/>
				))}
      </div>

      <h4>Activation Maps</h4>
      <div className="layer-grid">
				{activationSrcs.map((src, idx) => (
					<img 
						key={idx} 
						src={src} 
						alt={`Activation Map ${idx}`} 
					/>
				))}
      </div>
    </div>
  );
}

export default Conv2dLayerViewer;
