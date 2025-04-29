import React, { useRef, useState, useEffect } from "react";
import '../index.css'

const CanvasArea = ({
  lineArtImages,
  setLineArtImages,
  brushSize,
  brushColor,
  eraserMode,
  isDraggingImage,
  setIsDraggingImage,
  currentImageIndex,
  setCurrentImageIndex,
  dragOffset,
  setDragOffset,
}) => {
  const canvasRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);

  const startDrawing = (x, y) => {
    if (isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor;
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (x, y) => {
    if (!isDrawing || isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawAllImages = () => {
    const canvas = imageCanvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    lineArtImages.forEach((image) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow cross-origin images to be drawn
      img.src = image.src;
      img.onload = () => {
        context.drawImage(
          img,
          image.position.x,
          image.position.y,
          image.size.width,
          image.size.height
        );
      };
    });
  };

  // Mouse events for desktop drawing
  const handleMouseDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    startDrawing(x, y);
  };

  const handleMouseMove = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    draw(x, y);
  };

  // Touch events for mobile drawing
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  return (
    <div className="canvasContainer">
      <canvas
        ref={imageCanvasRef}
        width="1192"
        height="650"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        style={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: "white",
        }}
      ></canvas>

      <canvas
        ref={canvasRef}
        width="1192"
        height="650"
        style={{
          border: "1px solid black",
          zIndex: 2,
          backgroundColor: "transparent",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      ></canvas>
    </div>
  );
};

export default CanvasArea;
