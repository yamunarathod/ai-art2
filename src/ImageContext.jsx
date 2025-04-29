// // ImageContext.js
// import React, { createContext, useState } from "react";

// // Create the context
// export const ImageContext = createContext();

// // Create the provider component
// export const ImageProvider = ({ children }) => {
//   const [canvasDrawingUrl, setCanvasDrawingUrl] = useState(null); // Store canvas drawing URL
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Store uploaded image URL

//   return (
//     <ImageContext.Provider
//       value={{
//         canvasDrawingUrl,
//         setCanvasDrawingUrl,
//         uploadedImageUrl,
//         setUploadedImageUrl,
//       }}
//     >
//       {children}
//     </ImageContext.Provider>
//   );
// };


// // ImageContext.jsx
// import React, { createContext, useState } from "react";

// // Create the context
// export const ImageContext = createContext();

// export const ImageProvider = ({ children }) => {
//   const [canvasDrawingUrl, setCanvasDrawingUrl] = useState("");
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");

//   return (
//     <ImageContext.Provider
//       value={{
//         canvasDrawingUrl,
//         setCanvasDrawingUrl,
//         uploadedImageUrl,
//         setUploadedImageUrl,
//       }}
//     >
//       {children}
//     </ImageContext.Provider>
//   );
// };


// ImageContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [canvasDrawingUrl, setCanvasDrawingUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Log the context values to the console whenever they change
  useEffect(() => {
    console.log("canvasDrawingUrl:", canvasDrawingUrl);
    console.log("uploadedImageUrl:", uploadedImageUrl);
  }, [canvasDrawingUrl, uploadedImageUrl]);

  return (
    <ImageContext.Provider
      value={{
        canvasDrawingUrl,
        setCanvasDrawingUrl,
        uploadedImageUrl,
        setUploadedImageUrl,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
