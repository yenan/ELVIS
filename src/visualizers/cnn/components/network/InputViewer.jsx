import Button from "../../../../components/Button/Button.jsx";
import "./LayerViewer.css";


function extractImage(output) {
  const [batchSize, H, W, C] = output.shape;
  const data = output.dataSync();
  const buffer = new Uint8ClampedArray(H * W * 4);
  for (let i = 0; i < H; ++i) {
    for (let j = 0; j < W; ++j) {
      for (let c = 0; c < C; ++c) {
        const val = data[
          0 * H * W * C +  // batch index 0
          i * W * C +
          j * C +
          c
        ];
        buffer[(i * W + j) * 4 + c] = val * 255;
      }
      for (let c = C; c < 3; ++c) {
        buffer[(i * W + j) * 4 + c] = buffer[(i * W + j) * 4 + (C - 1)]; // replicate last channel
      }
      buffer[(i * W + j) * 4 + 3] = 255; // A
    }
  }

  return new ImageData(buffer, W, H);
}


function imgDataToSrc(imgData) {
  const canvas = document.createElement('canvas');
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}


function InputViewer(props) {
	const [batchSize, H, W, C] = props.output.shape;

	const imgData = extractImage(props.output);
	const imgSrc = imgDataToSrc(imgData);

	return (
		<div className="layer-viewer">
			<h3 className="layer-title">Input Layer</h3>

		  <div className="layer-details">
		    <div><strong>Input size:</strong> {imgData.width} x {imgData.height}</div>
		  </div>

			<h4>Sample input</h4>
		  <div className="layer-grid">
		    {imgSrc && (
					<img key={0} src={imgSrc} alt={`Input Image`} />
		    )}
        <Button onClick={props.onSampleIndexChange}>New Sample</Button>
		  </div>
		</div>
	);
}

export default InputViewer;

