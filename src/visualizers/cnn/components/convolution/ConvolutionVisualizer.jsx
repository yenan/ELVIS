import { useRef, useState } from 'react'
import './ConvolutionViewer.css'
import ConvolutionViewer from "./ConvolutionViewer.jsx"
import Sidebar from "./Sidebar.jsx"


const DEFAULT_IMAGE = "./mario.png"

const DEFAULT_KERNEL = [
  [
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1],
  ],
  [
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1],
  ],
  [
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1],
  ]
];


function ConvolutionVisualizer() {
  const canvasRef = useRef(null);

  const [kernel, setKernel] = useState(DEFAULT_KERNEL);
  const [image, setImage] = useState(DEFAULT_IMAGE);

  const [grayImage, setGrayImage] = useState(null);
  const [colorImage, setColorImage] = useState(null);

  const [useColor, setUseColor] = useState(true);

  function handleUpload(file) {
    const url = URL.createObjectURL(file);
    setImage(url);
  }

  return (
    <>
      <div className="main-container">
        <ConvolutionViewer 
          inputImageUrl={image} 
          kernel={kernel} 
          grayImage={grayImage} 
          setGrayImage={setGrayImage}
          colorImage={colorImage}
          setColorImage={setColorImage}
          useColor={useColor}
        />
        <Sidebar 
          kernel={kernel} 
          onKernelChange={setKernel} 
          onUpload={handleUpload} 
          useColor={useColor}
          onUseColor={setUseColor}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  )
}

export default ConvolutionVisualizer;
