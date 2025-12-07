import { useState, useEffect, useMemo } from "react";
import "./LayerViewer.css";


function extractKernels(kernels, selectedOutputChannel, kh, kw, inC, outC) {
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

function extractActivationMaps(output, H, W, C) {
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (let i = 0; i < output.length; ++i) {
    const val = output[i];
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
        const val = output[
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
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [kh, kw, inC, outC] = props.kernelShape;
  const [batch, H, W, C] = props.outputShape;

  const kernels = useMemo(() => {
		if (selectedChannel == null) {
			return null;
		}
    return extractKernels(props.kernels, selectedChannel, kh, kw, inC, outC);
  }, [props.tick, selectedChannel]);

  const kernelSrcs = useMemo(() => {
		if (kernels == null) {
			return null;
		}
    return kernels.map(imgDataToSrc);
  }, [kernels]);

  const activations = useMemo(() => {
    return extractActivationMaps(props.output, H, W, C);
  }, [props.tick]);

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

			{selectedChannel != null && (
				<>
					<h4>Kernel for output {selectedChannel} (min-max normalized)</h4>
					<div className="layer-grid">
						{kernelSrcs.map((src, idx) => (
							<img 
								key={`${props.layerIdx}-${idx}-kernel`} 
								src={src} 
								alt={`Kernel ${idx}`} 
							/>
						))}
					</div>
				</>
			)}

      <h4>Activation Maps (min-max normalized)</h4>
      <div className="layer-grid">
				{activationSrcs.map((src, idx) => (
					<img 
						key={`${props.layerIdx}-${idx}-activation`} 
						src={src} 
						alt={`Activation Map ${idx}`} 
            onClick={() => 
							setSelectedChannel(selectedChannel === idx ? null : idx)
						}
            style={{border: selectedChannel === idx ? '4px solid lime' : 'none'}}
					/>
				))}
      </div>
    </div>
  );
}

export default Conv2dLayerViewer;
