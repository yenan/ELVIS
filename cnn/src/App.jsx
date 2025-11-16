import { useRef, useState } from 'react'
import './App.css'
import ConvolutionViewer from "./components/ConvolutionViewer.jsx"
import Sidebar from "./components/Sidebar.jsx"


// const DEFAULT_IMAGE = "./cat.JPG"
const DEFAULT_IMAGE = "./mario.png"

function App() {
  const canvasRef = useRef(null);
  const [kernel, setKernel] = useState([
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ]);

  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [grayImage, setGrayImage] = useState(null);
  const [boundingBox, setBoundingBox] = useState(null);

  function handleUpload(file) {
    const url = URL.createObjectURL(file);
    setImage(url);
  }

  function handleBoundingBoxButton() {
    if (boundingBox && grayImage) {
      const { x, y, width, height } = boundingBox;
      if (width <= 0 || height <= 0) {
        return;
      }

      // fill in new kernel
      const newKernel = [];
      for (let row = 0; row < height; ++row) {
        const rowArray = [];
        for (let col = 0; col < width; ++col) {
          const imgX = x + col;
          const imgY = y + row;
          const imgIndex = (imgY * grayImage.width + imgX) * 4;
          const pixelValue = grayImage.data[imgIndex];
          rowArray.push(pixelValue);
        }
        newKernel.push(rowArray);
      }

      // normalize
      mean = newKernel.flat().reduce((a, b) => a + b, 0) / (width * height);
      std = Math.sqrt(newKernel.flat().reduce((a, b) => a + (b - mean) ** 2, 0) / (width * height));
      for (let row = 0; row < newKernel.length; ++row) {
        for (let col = 0; col < newKernel[0].length; ++col) {
          newKernel[row][col] = (newKernel[row][col] - mean) / (std || 1);
        }
      }
      
      setKernel(newKernel);
    }
 }

  return (
    <>
      <h1>CNN Visualizer</h1>
      <div className="main-container">
        <ConvolutionViewer 
          inputImage={image} 
          kernel={kernel} 
          grayImage={grayImage} 
          setGrayImage={setGrayImage}
          setBoundingBox={setBoundingBox}
        />
        <Sidebar 
          kernel={kernel} 
          onKernelChange={setKernel} 
          onUpload={handleUpload} 
          onBoundingBoxButton={handleBoundingBoxButton}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  )
}

export default App;
