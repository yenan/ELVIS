import { useState, useEffect, useRef } from "react";
import BoundingBoxDrawer from "./BoundingBoxDrawer.jsx";
import "./ConvolutionViewer.css";

function ConvolutionViewer(props) {
  const canvasRef = useRef(null);
  const [inputUrl, setInputUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);

  function handleBoxDrawn(box) {
    if (box.width > 0 && box.height > 0) {
      props.setBoundingBox(box);
    } else {
      props.setBoundingBox(null);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    img.src = props.inputImage;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      // get image data
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.21 * r + 0.72 * g + 0.07 * b;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      props.setGrayImage(imageData);

      // create data URL for input image
      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL();
      setInputUrl(url);
    };
  }, [props.inputImage]);

  useEffect( () => {
    if (props.grayImage && props.kernel) {
      const kernelWidth = props.kernel[0].length;
      const kernelHeight = props.kernel.length;
      const kernelSize = kernelWidth * kernelHeight;

      const kernel = props.kernel.flat();

      const hasInvalid = kernel.some(
        (v) => 
          v === "" || 
          v === null || 
          v === undefined || 
          !Number.isFinite(v)
      );
      if (hasInvalid) {
        return;
      }

      const width = props.grayImage.width;
      const height = props.grayImage.height;
      const inputData = props.grayImage.data;

      const outputWidth = width - kernelWidth + 1;
      const outputHeight = height - kernelHeight + 1;
      const outputData = new Uint8ClampedArray(outputWidth * outputHeight * 4);

      for (let y = 0; y < height - kernelHeight + 1; ++y) {
        for (let x = 0; x < width - kernelWidth + 1; ++x) {
          // dot product
          let sum = 0;
          for (let ky = 0; ky < kernelHeight; ++ky) {
            for (let kx = 0; kx < kernelWidth; ++kx) {
              const kernelValue = kernel[ky * kernelWidth + kx];
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
              const grayValue = inputData[pixelIndex];
              sum += grayValue * kernelValue;
            }
          }

          const outputIndex = (y * outputWidth + x) * 4;
          const clampedValue = Math.min(Math.max(sum, 0), 255);
          outputData[outputIndex] = clampedValue;     // R
          outputData[outputIndex + 1] = clampedValue; // G
          outputData[outputIndex + 2] = clampedValue; // B
          outputData[outputIndex + 3] = 255;          // A
        }
      }

      // draw output on canvas to get data URL
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const outputImageData = new ImageData(outputData, outputWidth, outputHeight);
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      ctx.putImageData(outputImageData, 0, 0);
      const url = canvas.toDataURL();
      setOutputUrl(url);
    }
  }, [props.grayImage, props.kernel]);

  return (
    <div className="convolution-viewer">
      <div className="convolution-viewer-item">
        <h3>Input</h3>
        { inputUrl ? (
          <BoundingBoxDrawer image={inputUrl} onBoxDrawn={handleBoxDrawn} />
          // <img src={inputUrl} alt="Input" />
        ) : ( <p>Loading...</p> 
        )}
      </div>
      <div className="convolution-viewer-item">
        <h3>Output</h3>
        { outputUrl ? (
          <img src={outputUrl} alt="Output" />
        ) : ( <p>Processing...</p> 
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default ConvolutionViewer;
