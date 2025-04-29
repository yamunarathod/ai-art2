import React from "react";
import '../index.css'
const StyleSelector = ({ selectedStyle, handleStyleSelect }) => {
  const styles = ["Fantasy Art", "Neon Punk", "Hyperrealism", "Comic Book"];

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
              color: selectedStyle === style ? "#000" : "#fff",
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
