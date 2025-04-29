import React from "react";
import '../index.css'
const LineArtSelector = ({ handleLineArtSelect }) => {
  const lineArtOptions = [
    { src: "/path/to/image1.png", text: "Line Art 1" },
    { src: "/path/to/image2.png", text: "Line Art 2" },
    // Add more line art options here
  ];

  return (
    <div className="lineArtSelector">
      <h3>Select Line Art</h3>
      <div className="lineArtImages">
        {lineArtOptions.map((lineArt, index) => (
          <img
            key={index}
            src={lineArt.src}
            alt={lineArt.text}
            onClick={() => handleLineArtSelect(lineArt)}
          />
        ))}
      </div>
    </div>
  );
};

export default LineArtSelector;
