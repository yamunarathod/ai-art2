

import { useState } from "react";

const LineArtSelector = ({ onLineArtSelect }) => {
  const lineArtDivs = [
    {
      src: "/a1.svg",
      text: "Robot",
      subImages: [
        { src: "/dd/a1.svg", icon: "/d/a1.svg", text: "Mechanical robot" },
        { src: "/dd/a2.svg", icon: "/d/a2.svg", text: "robot dog" },
        { src: "/dd/a3.svg", icon: "/d/a3.svg", text: "robotic dog" },
        { src: "/dd/a4.svg", icon: "/d/a4.svg", text: "robot cat" },
        { src: "/dd/a5.svg", icon: "/d/a5.svg", text: "robot in Spaceship" },
        { src: "/dd/a6.svg", icon: "/d/a6.svg", text: "robot construction" },
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