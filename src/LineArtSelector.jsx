import { useState } from "react";

const LineArtSelector = ({ onLineArtSelect }) => {
  const lineArtDivs = [
    {
      src: "/a1.svg",
      text: "Robot",
      subImages: [
        { src: "/dd/a1.svg", icon: "/d/a1.svg", text: "Mechanical robot" },
        { src: "/dd/a3.svg", icon: "/d/a3.svg", text: "robot dog" },
        { src: "/dd/a4.svg", icon: "/d/a4.svg", text: "robot cat" },
        { src: "/dd/a5.svg", icon: "/d/a5.svg", text: "robot UFO" },
      ],
    },
    {
      src: "/a2.svg",
      text: "Space",
      subImages: [
        { src: "/h1.svg", icon: "/hh1.svg", text: "Rocket" },
        { src: "/h2.svg", icon: "/hh2.svg", text: "Satellite" },
        { src: "/h3.svg", icon: "/hh3.svg", text: "astronaut" },
        { src: "/h4.svg", icon: "/hh4.svg", text: "UFO" },
      ],
    },
    {
      src: "/a3.png",
      text: "Drone",
      subImages: [
        { src: "/dd/c1.svg", icon: "/d/c1.svg", text: "Drone" },
        { src: "/dd/c2.svg", icon: "/d/c2.svg", text: "Drone Delivery" },
        { src: "/dd/c3.svg", icon: "/d/c3.svg", text: "Drone Bomber" },
        { src: "/dd/c4.svg", icon: "/d/c4.svg", text: "Drone Control" },
      ],
    },
    {
      src: "/a4.png",
      text: "SuperCore",
      subImages: [
        { src: "/dd/b1.svg", icon: "/d/b1.svg", text: "Computer" },
        { src: "/dd/b2.svg", icon: "/d/b2.svg", text: "Chip" },
        { src: "/dd/b3.svg", icon: "/d/b3.svg", text: "Cloud Computing" },
        { src: "/dd/b5.svg", icon: "/d/b5.svg", text: "Brain+Chip" },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0); // Start with Robot (index 0) as default
  const [subImageIndex, setSubImageIndex] = useState(0);
  const [selectedShapes, setSelectedShapes] = useState(new Set());
  const visibleSubImages = 4;

  const handleNext = () => {
    setSubImageIndex((prev) =>
      Math.min(
        prev + visibleSubImages,
        lineArtDivs[activeIndex].subImages.length - visibleSubImages
      )
    );
  };

  const handlePrev = () => {
    setSubImageIndex((prev) => Math.max(prev - visibleSubImages, 0));
  };

  return (
    <div className="whole-line-art-g-container">
      <h4 className="selectShape">SELECT SHAPE</h4>

      {/* Shape group */}
      <div
        className="main-line-art-selector"
        role="tablist"
        aria-label="Shape categories"
      >
        {lineArtDivs.map((lineArt, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => {
                setActiveIndex(index);
                setSubImageIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setActiveIndex(index);
                  setSubImageIndex(0);
                }
              }}
              className={`line-art-boxes ${isActive ? "is-active" : ""}`}
            >
              <p>{lineArt.text}</p>
            </div>
          );
        })}
      </div>

      {/* Sub images carousel */}
      <div className="sub-lineart-image-selector">
        {subImageIndex > 0 && (
          <button
            onClick={handlePrev}
            aria-label="Previous"
            style={{
              backgroundImage: 'url("/left.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              border: "none",
              outline: "none",
              width: 30,
              height: 30,
              marginTop: -28,
              backgroundColor: "transparent",
            }}
          />
        )}

        {lineArtDivs[activeIndex].subImages
          .slice(subImageIndex, subImageIndex + visibleSubImages)
          .map((subImage) => {
            const shapeId = `${activeIndex}-${subImage.src}`;
            const isSelected = selectedShapes.has(shapeId);

            return (
              <div key={subImage.src} className="main-sub-image-main-lineart">
                <div
                  onClick={() => {
                    onLineArtSelect(subImage);
                    setSelectedShapes((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(shapeId)) {
                        newSet.delete(shapeId);
                      } else {
                        newSet.add(shapeId);
                      }
                      return newSet;
                    });
                  }}
                  draggable
                  className={`linert-gg55op ${isSelected ? "is-active" : ""}`}
                  title={subImage.text}
                >
                  <img
                    src={subImage.icon}
                    alt={subImage.text}
                    className="inside-image-line-art"
                  />
                </div>
              </div>
            );
          })}

        {subImageIndex + visibleSubImages <
          lineArtDivs[activeIndex].subImages.length && (
          <button
            onClick={handleNext}
            aria-label="Next"
            style={{
              backgroundImage: 'url("/right.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              border: "none",
              width: 20,
              height: 30,
              marginTop: -28,
              backgroundColor: "transparent",
              marginRight: 40,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LineArtSelector;
