// // import React from "react";

// // const LineArtSelector = ({ onLineArtSelect }) => {
// //   // These are placeholders for line art images, replace with actual URLs or images
// //   // const lineArtImages = [
// //   //     '/1.jpg',
// //   //     '/2.jpg',
// //   //     '/3.jpg'
// //   // ];

// //   const lineArtImages = [
// //     { src: "/a1.svg", text: "A cycle" },
// //     { src: "/a2.svg", text: "a tree" },
// //     { src: "/a3.png", text: "a tree" },
// //     { src: "/a4.png", text: "A cow" },
// //   ];

// //   return (
// //     <div>
// //       <h4>SELECT SHAPES</h4>
// //       <div style={{ display: "flex", gap: "10px", }}>
// //         {lineArtImages.map((lineArt, index) => (
// //           <img
// //             key={index}
// //             src={lineArt.src}
// //             alt={`Line Art ${index + 1}`}
// //             draggable="true"
// //             onClick={() => onLineArtSelect(lineArt)} // Pass the image and associated text
// //             style={{
// //               width: "100px",
// //               height: "100px",
// //               cursor: "grab",
// //               border: "1px solid #fff",
// //               borderRadius:"14px",
// //             //   backgroundColor:"#fff",
// //               padding:"13px"
// //             }}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LineArtSelector;

// // import React, { useState } from "react";

// // const LineArtSelector = ({ onLineArtSelect }) => {
// //   // Main line art images with corresponding sub-images
// //   const lineArtDivs = [
// //     {
// //       src: "/a1.svg",
// //       text: "A cycle",
// //       subImages: [
// //         { src: "/dd/a1.svg", text: "A bike wheel" },
// //         { src: "/dd/a2.svg", text: "A handlebar" },
// //         { src: "/dd/a3.svg", text: "A seat" },
// //         { src: "/dd/a4.svg", text: "A pedal" },
// //       ],
// //     },
// //     {
// //       src: "/a2.svg",
// //       text: "A tree",
// //       subImages: [
// //         { src: "/dd/b1.svg", text: "A leaf" },
// //         { src: "/dd/b2.svg", text: "A branch" },
// //         { src: "/dd/b3.svg", text: "A root" },
// //         { src: "/dd/b4.svg", text: "A trunk" },
// //       ],
// //     },
// //     {
// //       src: "/a3.png",
// //       text: "A tree",
// //       subImages: [
// //         { src: "/dd/c1.svg", text: "A small tree" },
// //         { src: "/dd/c2.svg", text: "A medium tree" },
// //         { src: "/dd/c3.svg", text: "A large tree" },
// //         { src: "/dd/c4.svg", text: "A tiny tree" },
// //       ],
// //     },
// //     {
// //       src: "/a4.png",
// //       text: "A cow",
// //       subImages: [
// //         { src: "/dd/d1.svg", text: "A cow head" },
// //         { src: "/dd/d2.png", text: "A cow body" },
// //         { src: "/dd/d3.svg", text: "A cow tail" },
// //         { src: "/dd/d4.svg", text: "A cow legs" },
// //       ],
// //     },
// //   ];

// //   // State to track the active main image
// //   const [activeIndex, setActiveIndex] = useState(0); // Start with the first image active

// //   // Handle when the main image is clicked, setting it as active
// //   const handleMainImageClick = (index) => {
// //     setActiveIndex(index); // Update the active index
// //   };

// //   return (
// //     <div>
// //       <h4>Select Line Art Shape</h4>
// //       {/* Main Image Selector */}
// //       <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
// //         {lineArtDivs.map((lineArt, index) => (
// //           <div
// //             key={index}
// //             onClick={() => handleMainImageClick(index)} // Set the clicked image as active
// //             style={{
// //               border: activeIndex === index ? "3px solid #000" : "1px solid #fff",
// //               borderRadius: "8px",
// //               padding: "5px 38px",
// //               cursor: "pointer",
// //               backgroundColor: activeIndex === index ? "#f0f0f0" : "#000",
// //               color: activeIndex === index ? "#000" : "#fff",
// //             }}
// //           >
// //             {/* <img
// //               src={lineArt.src}
// //               alt={`Line Art ${index + 1}`}
// //               style={{
// //                 width: "100px",
// //                 height: "100px",
// //               }}
// //             /> */}

// //             <p>{lineArt.text}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Sub-Image Selector based on active main image */}
// //       <div style={{ display: "flex", gap: "10px" }}>
// //         {lineArtDivs[activeIndex].subImages.map((subImage, subIndex) => (
// //           <img
// //             key={subIndex}
// //             src={subImage.src}
// //             alt={`Sub Image ${subIndex + 1}`}
// //             draggable="true"
// //             onClick={() => onLineArtSelect(subImage)} // Pass the selected sub-image to the parent
// //             style={{
// //               width: "100px",
// //               height: "100px",
// //               cursor: "grab",
// //               border: "1px solid #fff",
// //               borderRadius: "14px",
// //               padding: "13px",
// //             }}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LineArtSelector;

// import React, { useState } from "react";




// const LineArtSelector = ({ onLineArtSelect }) => {
//   // Main line art images with corresponding sub-images and icons
//   const lineArtDivs = [
//     {
//       src: "/a1.svg",
//       text: "Nature",
//       subImages: [
//         { src: "/dd/a1.svg", icon: "/d/a1.svg", text: "Big Tree" },
//         { src: "/dd/a2.svg", icon: "/d/a2.svg", text: "Pasture" },
//         { src: "/dd/a3.svg", icon: "/d/a3.svg", text: "Leaf" },
//         { src: "/dd/a4.svg", icon: "/d/a4.svg", text: "Flower" },
//         { src: "/dd/a5.svg", icon: "/d/a5.svg", text: "Bush" },
//         { src: "/dd/a6.svg", icon: "/d/a6.svg", text: "Mountain" },
//       ],
//     },
//     {
//       src: "/a2.svg",
//       text: "House",
//       subImages: [
//         { src: "/h1.svg", icon: "/hh1.svg", text: "Villa" },
//         { src: "/h2.svg", icon: "/hh2.svg", text: "Mansion" },
//         { src: "/h3.svg", icon: "/hh3.svg", text: "Cottage" },
//         { src: "/h4.svg", icon: "/hh4.svg", text: "Skyscraper" },
//         { src: "/h5.svg", icon: "/hh5.svg", text: "Bungalow" },
//         { src: "/h6.svg", icon: "/hh6.svg", text: "Farmhouse" },
//       ],
//     },
//     {
//       src: "/a3.png",
//       text: "Automobile",
//       subImages: [
//         { src: "/dd/c1.svg", icon: "/d/c1.svg", text: "Car" },
//         { src: "/dd/c2.svg", icon: "/d/c2.svg", text: "Ship" },
//         { src: "/dd/c3.svg", icon: "/d/c3.svg", text: "Aeroplane" },
//         { src: "/dd/c4.svg", icon: "/d/c4.svg", text: "Bus" },
//         { src: "/dd/c5.svg", icon: "/d/c5.svg", text: "Bike" },
//         { src: "/dd/c6.svg", icon: "/d/c6.svg", text: "Truck" },
//       ],
//     },
//     {
//       src: "/a4.p4ng",
//       text: "Infrastructure",
//       subImages: [
//         { src: "/highway.svg", icon: "/highway1.svg", text: "Highway"},
//         { src: "/metro.svg", icon: "/metro1.svg", text: "Metro" },
//         { src: "/crane.svg", icon: "/crane1.svg", text: "Crane" },
//         { src: "/bridge.svg", icon: "/bridge1.svg", text: "Bridge" },
//         { src: "/tower.svg", icon: "/tower1.svg", text: "Tower" },
//         { src: "/dam.svg", icon: "/dam1.svg", text: "Dam" },
//       ],
//     },
//   ];

//   // State to track the active main image
//   const [activeIndex, setActiveIndex] = useState(0); // Start with the first image active

//   // Handle when the main image is clicked, setting it as active
//   const handleMainImageClick = (index) => {
//     setActiveIndex(index); // Update the active index
//   };

//   return (
//     <div className="whole-line-art-g-container">
//       <h4>
//         SELECT SHAPE
//       </h4>
//       {/* Main Image Selector */}
//       <div className="main-line-art-selector">
//         {lineArtDivs.map((lineArt, index) => (
//           <div
//             key={index}
//             onClick={() => handleMainImageClick(index)}
//             className="line-art-boxes" // Set the clicked image as active
//             style={{
//               border:
//                 activeIndex === index ? "3px solid #FFFFFF" : "1px solid #fff",
//               background: activeIndex === index ? "#D12028" : "transparent",
//               color: activeIndex === index ? "#fff" : "#fff",
//               fontFamily: activeIndex === index ? "'bold', sans-serif" : "inherit", // Apply font only when active

//             }}
//           >
//             <p>{lineArt.text}</p>

//           </div>
          
//         ))}

//       </div>
//       {/* <h1 className="selectShape">SELECT SHAPES</h1> */}




//       {/* Sub-Image Selector based on active main image */}
//       <div
//         className="sub-lineart-image-selector"
//       >
//         {lineArtDivs[activeIndex].subImages.map((subImage, subIndex) => (
//           <div key={subIndex} className="main-sub-image-main-lineart">
//             <div
//               onClick={() => onLineArtSelect(subImage)} // Pass the selected sub-image to the parent
//               draggable="true"
//               className="linert-gg55op"
//             >
//               <img
//                 src={subImage.icon}
//                 alt={`Icon ${subIndex + 1}`}
//                 className="inside-image-line-art"
//               />
//             </div>
//             <div>
//               <p style={{ fontSize: "12px", textAlign: "center", color: "white" }}>
//                 {subImage.text}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LineArtSelector;




import { useState } from "react";

const LineArtSelector = ({ onLineArtSelect }) => {
  const lineArtDivs = [
    {
      src: "/a1.svg",
      text: "Nature",
      subImages: [
        { src: "/dd/a1.svg", icon: "/d/a1.svg", text: "Big Tree" },
        { src: "/dd/a2.svg", icon: "/d/a2.svg", text: "Pasture" },
        { src: "/dd/a3.svg", icon: "/d/a3.svg", text: "Leaf" },
        { src: "/dd/a4.svg", icon: "/d/a4.svg", text: "Flower" },
        { src: "/dd/a5.svg", icon: "/d/a5.svg", text: "Bush" },
        { src: "/dd/a6.svg", icon: "/d/a6.svg", text: "Mountain" },
      ],
    },
    {
      src: "/a2.svg",
      text: "House",
      subImages: [
        { src: "/h1.svg", icon: "/hh1.svg", text: "Villa" },
        { src: "/h2.svg", icon: "/hh2.svg", text: "Mansion" },
        { src: "/h3.svg", icon: "/hh3.svg", text: "Cottage" },
        { src: "/h4.svg", icon: "/hh4.svg", text: "Skyscraper" },
        { src: "/h5.svg", icon: "/hh5.svg", text: "Bungalow" },
        { src: "/h6.svg", icon: "/hh6.svg", text: "Farmhouse" },
      ],
    },
    {
      src: "/a3.png",
      text: "Automobile",
      subImages: [
        { src: "/dd/c1.svg", icon: "/d/c1.svg", text: "Car" },
        { src: "/dd/c2.svg", icon: "/d/c2.svg", text: "Ship" },
        { src: "/dd/c3.svg", icon: "/d/c3.svg", text: "Aeroplane" },
        { src: "/dd/c4.svg", icon: "/d/c4.svg", text: "Bus" },
        { src: "/dd/c5.svg", icon: "/d/c5.svg", text: "Truck" },
        { src: "/dd/c6.svg", icon: "/d/c6.svg", text: "Tractor" },
      ],
    },
    {
      src: "/a4.png",
      text: "Infrastructure",
      subImages: [
        { src: "/highway.svg", icon: "/highway1.svg", text: "Highway" },
        { src: "/metro.svg", icon: "/metro1.svg", text: "Metro" },
        { src: "/crane.svg", icon: "/crane1.svg", text: "Crane" },
        { src: "/bridge.svg", icon: "/bridge1.svg", text: "Bridge" },
        { src: "/port.svg", icon: "/port1.svg", text: "Port" },
        { src: "/airport.svg", icon: "/airport1.svg", text: "Airport" },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [subImageIndex, setSubImageIndex] = useState(0);
  const visibleSubImages = 4;

  const handleNext = () => {
    setSubImageIndex((prev) =>
      Math.min(prev + visibleSubImages, lineArtDivs[activeIndex].subImages.length - visibleSubImages)
    );
  };

  const handlePrev = () => {
    setSubImageIndex((prev) => Math.max(prev - visibleSubImages, 0));
  };

  return (
    <div className="whole-line-art-g-container">
      <h4>SELECT SHAPE</h4>
      <div className="main-line-art-selector">
        {lineArtDivs.map((lineArt, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setSubImageIndex(0);
            }}
            className="line-art-boxes"
            style={{
              border: activeIndex === index ? "3px solid #FFFFFF" : "1px solid #fff",
              background: activeIndex === index ? "#504C9C" : "#322554",
              color: "#fff",
              fontFamily: activeIndex === index ? "bold, sans-serif" : "inherit",
            }}
          >
            <p>{lineArt.text}</p>
          </div>
        ))}
      </div>
      <div className="sub-lineart-image-selector">
        {subImageIndex > 0 && (
          <button
            onClick={handlePrev}
            style={{
              backgroundImage: 'url("/left.png")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              border: 'none',
              outline: 'none',
              width: '20px',
              height: '30px',
              marginTop: '-28px', // Move the button up
              backgroundColor: 'transparent',
            }}
          >
            &lt;
          </button>
        )}
        {lineArtDivs[activeIndex].subImages
          .slice(subImageIndex, subImageIndex + visibleSubImages)
          .map((subImage, subIndex) => (
            <div key={subImage.src} className="main-sub-image-main-lineart">
              <div onClick={() => onLineArtSelect(subImage)} draggable="true" className="linert-gg55op">
                <img src={subImage.icon} alt={subImage.text} className="inside-image-line-art" />
              </div>
              <p style={{ fontSize: "12px", textAlign: "center", color: "white" }}>{subImage.text}</p>
            </div>
          ))}
        {subImageIndex + visibleSubImages < lineArtDivs[activeIndex].subImages.length && (
          <button
            onClick={handleNext}
            style={{
              backgroundImage: 'url("/right.png")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              border: 'none',
              width: '20px',
              height: '30px',
              marginTop: '-28px', // Move the button up
              backgroundColor: 'transparent',
              marginRight: '40px',
            }}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default LineArtSelector;