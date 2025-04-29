import React from "react";
import '../index.css'
const Toolbar = ({ brushSize, setBrushSize, eraserMode, toggleEraser, clearCanvas }) => {
  return (
    <div className="toolbar">
      <input
        type="range"
        min="1"
        max="10"
        value={brushSize}
        onChange={(e) => setBrushSize(e.target.value)}
      />
      <button onClick={toggleEraser}>
        {eraserMode ? "Switch to Brush" : "Switch to Eraser"}
      </button>
      <button onClick={clearCanvas}>Clear Canvas</button>
    </div>
  );
};

export default Toolbar;
