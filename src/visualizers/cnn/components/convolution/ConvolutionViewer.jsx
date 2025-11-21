import { useState, useEffect, useRef } from "react";
import { getImageData, convertToGrayscale } from "../../utils/image";
import { convolveGray, convolveColor } from "../../utils/convolution";
import "./ConvolutionViewer.css";

function ConvolutionViewer(props) {
  const canvasRef = useRef(null);
  const [inputUrl, setInputUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);

  // load input image and prepare gray and color image arrays
  useEffect(() => {
    async function process() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const imageData = await getImageData(props.inputImageUrl, canvas, ctx);

      const grayImageData = convertToGrayscale(imageData);
      props.setColorImage(imageData);
      props.setGrayImage(grayImageData);
    }

    process();

  }, [props.inputImageUrl]);

  // set input image URL for display
  useEffect(() => {
    if (!props.useColor && !props.grayImage) {
      return;
    }
    if (props.useColor && !props.colorImage) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (props.useColor) {
      ctx.putImageData(props.colorImage, 0, 0);
      setInputUrl(canvas.toDataURL());
    } else {
      ctx.putImageData(props.grayImage, 0, 0);
      setInputUrl(canvas.toDataURL());
    }
  }, [props.useColor, props.colorImage, props.grayImage]);

  // perform convolution and set output image URL for display
  useEffect( () => {
    if (!props.kernel) {
      return;
    }
    const hasInvalid = props.kernel.flat().flat().some(
      (v) => 
        v === "" || 
        v === null || 
        v === undefined || 
        !Number.isFinite(v)
    );
    if (hasInvalid) {
      return;
    }

    if (props.useColor && !props.colorImage) {
      return;
    }
    if (!props.useColor && !props.grayImage) {
      return;
    }

    const outputImageData = props.useColor 
      ? convolveColor(props.colorImage, props.kernel) 
      : convolveGray(props.grayImage, props.kernel[0]);
    
    // draw output on canvas to get data URL
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = outputImageData.width;
    canvas.height = outputImageData.height;
    ctx.putImageData(outputImageData, 0, 0);
    const url = canvas.toDataURL();
    setOutputUrl(url);
     
  }, [props.useColor, props.grayImage, props.colorImage, props.kernel]);

  return (
    <div className="convolution-viewer">
      <div className="convolution-viewer-item">
        <h3>Input</h3>
        { inputUrl ? (
          <img src={inputUrl} alt="Input" />
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
