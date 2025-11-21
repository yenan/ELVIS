export function convolveGray(image, kernel) {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;

  const width = image.width;
  const height = image.height;
  const inputData = image.data;

  const outputWidth= width - kernelWidth + 1;
  const outputHeight = height - kernelHeight + 1;
  const outputData = new Uint8ClampedArray(outputWidth * outputHeight * 4);

  for (let y = 0; y < outputHeight; ++y) {
    for (let x = 0; x < outputWidth; ++x) {

      // dot product
      let sum = 0;
      for (let ky = 0; ky < kernelHeight; ++ky) {
        for (let kx = 0; kx < kernelWidth; ++kx) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const pixelValue = inputData[pixelIndex];
          const kernelValue = kernel[ky][kx];
          sum += pixelValue * kernelValue;
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

  return new ImageData(outputData, outputWidth, outputHeight);
}
    
export function convolveColor(image, kernel) {
  const kernelWidth = kernel[0][0].length;
  const kernelHeight = kernel[0].length;

  const width = image.width;
  const height = image.height;
  const inputData = image.data;

  const outputWidth= width - kernelWidth + 1;
  const outputHeight = height - kernelHeight + 1;
  const outputData = new Uint8ClampedArray(outputWidth * outputHeight * 4);

  for (let y = 0; y < outputHeight; ++y) {
    for (let x = 0; x < outputWidth; ++x) {

      // dot product for each channel
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      
      for (let ky = 0; ky < kernelHeight; ++ky) {
        for (let kx = 0; kx < kernelWidth; ++kx) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const r = inputData[pixelIndex];
          const g = inputData[pixelIndex + 1];
          const b = inputData[pixelIndex + 2];
          
          const kernelR = kernel[0][ky][kx];
          const kernelG = kernel[1][ky][kx];
          const kernelB = kernel[2][ky][kx];
          sumR += r * kernelR;
          sumG += g * kernelG;
          sumB += b * kernelB;
        }
      }

      const outputIndex = (y * outputWidth + x) * 4;
      outputData[outputIndex] = Math.min(Math.max(sumR, 0), 255);     // R
      outputData[outputIndex + 1] = Math.min(Math.max(sumG, 0), 255); // G
      outputData[outputIndex + 2] = Math.min(Math.max(sumB, 0), 255); // B
      outputData[outputIndex + 3] = 255;                               // A
    }
  }

  return new ImageData(outputData, outputWidth, outputHeight);
}


