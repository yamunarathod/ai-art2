import React from "react";
import '../index.css'
const PromptSelector = ({ prompt, subPrompts, selectedSubPrompt, handlePromptSelect, handleSubPromptSelect }) => {
  const prompts = ["Sunset with Mountains", "Space", "Automobile", "Animal"];

  return (
    <div className="promptSelector">
      <h3>Select Prompt</h3>
      <div className="promptButtons">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => handlePromptSelect(p)}
            style={{
              border: prompt === p ? "2px solid #000" : "1px solid #ccc",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {subPrompts.length > 0 && (
        <div className="subPromptSelector">
          <h4>Select Sub-Prompt</h4>
          {subPrompts.map((sp) => (
            <button
              key={sp}
              onClick={() => handleSubPromptSelect(sp)}
              style={{
                border: selectedSubPrompt === sp ? "1px solid #000" : "none",
              }}
            >
              {sp}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptSelector;
