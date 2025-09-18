import React from "react";
import '../index.css'
const StyleSelector = ({ selectedStyle, handleStyleSelect }) => {
  const styles = ["Neon Punk", "Hyperrealism", "Comic Book", "Digital Art"];

  return (
    <div className="styleSelector">
      <h3>Select Style</h3>
      <div className="styleButtons">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => handleStyleSelect(style)}
            style={{
              backgroundColor: selectedStyle === style ? "#fff" : "transparent",
              color: selectedStyle === style ? "#fff" : "#D33A33",
            }}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
