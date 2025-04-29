import React from "react";
import '../index.css'
const SubmitButton = ({ handleSubmit, loading }) => {
  return (
    <div className="submitButton">
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Submit"}
      </button>
    </div>
  );
};

export default SubmitButton;
