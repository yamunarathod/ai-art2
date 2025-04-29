import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ReactLoading from "react-loading";
import { ImageContext } from "../src/ImageContext";
import "./UIScreen.css";

const Result = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();
  const handleRedraw = () => {
    navigate("/"); // Navigate to the root path
  };

  const { canvasDrawingUrl, uploadedImageUrl } = useContext(ImageContext);

  console.log("Received in result page:", canvasDrawingUrl, uploadedImageUrl); // Debugging

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);

  useEffect(() => {
    // Check if images are loaded or not
    const checkImageLoad = () => {
      if (uploadedImageUrl && canvasDrawingUrl) {
        const image1 = new Image();
        const image2 = new Image();

        image1.src = uploadedImageUrl;
        image2.src = canvasDrawingUrl;

        let loadedImages = 0;

        const onImageLoad = () => {
          loadedImages += 1;
          if (loadedImages === 2) {
            setIsImageLoading(false);
            setIsCanvasLoading(false);
          }
        };

        image1.onload = onImageLoad;
        image2.onload = onImageLoad;

        image1.onerror = () => setIsImageLoading(false);
        image2.onerror = () => setIsCanvasLoading(false);
      }
    };

    checkImageLoad();
  }, [uploadedImageUrl, canvasDrawingUrl]);

  return (
    <div className="ui-screen">
      <div className="content">
        <div className="image-area">
        <div className="result-image">
            {isImageLoading ? (
              <div className="loading-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 62 62"
                  width="700"
                  height="350"
                >
                  <circle cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(45 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.125s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(90 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.25s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(135 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.375s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(180 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.5s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(225 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.625s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(270 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.75s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                  <circle transform="rotate(315 16 16)" cx="16" cy="3" r="0" fill="white">
                    <animate
                      attributeName="r"
                      values="0;3;0;0"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.875s"
                      keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                      calcMode="spline"
                    ></animate>
                  </circle>
                </svg>
              </div>
       
            ) : (
              <img src={uploadedImageUrl} alt="Futuristic cityscape" />
            )}
          </div>
          <div className="art-image">
            {isCanvasLoading ? (
              <div className="loading-container">
                <ReactLoading
                  type="spinningBubbles"
                  color="#fff"
                  height={200}
                  width={200}
                />{" "}
                {/* Larger and white spinner */}
              </div>
            ) : (
              <img src={canvasDrawingUrl} alt="Art image placeholder" />
            )}
          </div>
        </div>
        <div className="qr-area">
          <div className="download-info">
            <h2>Scan To Download</h2>
          </div>
          <div className="qr-code">
            <QRCodeCanvas value={uploadedImageUrl} size={256} />
          </div>
          <button className="redraw-button" onClick={handleRedraw} style={{ color: '#322554' }}>
            Redraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
