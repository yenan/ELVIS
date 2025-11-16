import { useRef, useEffect, useState } from "react";

function BoundingBoxDrawer(props) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);
  const [current, setCurrent] = useState(null);

  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setCurrent({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
    drawBoundingBox();
  };

  function handleMouseMove(e) {
    if (!isDrawing) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrent({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    drawBoundingBox();
  };

  function handleMouseUp(e) {
    if (!isDrawing || !start || !current) {
      return;
    }
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);
    drawBoundingBox();
    props.onBoxDrawn({ x, y, width, height });

    setIsDrawing(false);
    setStart(null);
    setCurrent(null);
  }

  function drawBoundingBox() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = props.image;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (start && current) {
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          Math.min(start.x, current.x),
          Math.min(start.y, current.y),
          Math.abs(current.x - start.x),
          Math.abs(current.y - start.y)
        );
      }
    };
  }

  useEffect(() => {
    if (props.image) {
      drawBoundingBox();
    }
  }, [props.image]);

  return (
    <canvas
      ref={canvasRef}
      width={props.image.width}
      height={props.image.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default BoundingBoxDrawer;
