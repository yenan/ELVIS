import { useState, useEffect, useMemo } from "react";
import "./LayerViewer.css";


function extractKernels(weights, selectedOutputChannel) {
  const [kh, kw, inC, outC] = weights.shape;
  const kernels = weights.dataSync();
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

function extractActivationMaps(output) {
  const [batchSize, H, W, C] = output.shape;
  const activations = output.dataSync();
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

function Conv2dLayerViewer(props) {
  const [selectedChannel, setSelectedChannel] = useState(0);

  const [kh, kw, inC, outC] = props.weights.shape;
  const [batch, H, W, C] = props.output.shape;

  const kernels = useMemo(() => {
    return extractKernels(props.weights, selectedChannel);
  }, [props.weights, selectedChannel]);

  const kernelSrcs = useMemo(() => {
    return kernels.map(imgDataToSrc);
  }, [kernels]);

  const activations = useMemo(() => {
    return extractActivationMaps(props.output);
  }, [props.output]);

  const activationSrcs = useMemo(() => {
    return activations.map(imgDataToSrc);
  }, [activations]);


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

      <h4>Kernel for output {selectedChannel} (min-max normalized)</h4>
      <div className="layer-grid">
				{kernelSrcs.map((src, idx) => (
					<img 
						key={`${props.key}-${idx}-kernel`} 
						src={src} 
						alt={`Kernel ${idx}`} 
					/>
				))}
      </div>

      <h4>Activation Maps (min-max normalized)</h4>
      <div className="layer-grid">
				{activationSrcs.map((src, idx) => (
					<img 
						key={`${props.key}-${idx}-activation`} 
						src={src} 
						alt={`Activation Map ${idx}`} 
            onClick={() => setSelectedChannel(idx)}
            style={{border: selectedChannel === idx ? '4px solid lime' : 'none'}}
					/>
				))}
      </div>
    </div>
  );
}

export default Conv2dLayerViewer;
