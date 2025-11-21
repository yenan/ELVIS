export function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });
}

export async function getImageData(imageUrl, canvas, ctx) {
  const img = await loadImage(imageUrl);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

export function convertToGrayscale(imageData) {
  const { width, height } = imageData;
  const grayData = new ImageData(width, height);
  const src = imageData.data;
  const dst = grayData.data;

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];

    const gray = 0.21 * r + 0.72 * g + 0.07 * b;

    dst[i] = gray;
    dst[i + 1] = gray;
    dst[i + 2] = gray;
    dst[i + 3] = src[i + 3];
  }

  return grayData;
}

