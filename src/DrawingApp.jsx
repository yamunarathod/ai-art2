import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LineArtSelector from "./LineArtSelector";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { ImageContext } from "../src/ImageContext";
import { FaPaintBrush, FaEraser } from "react-icons/fa";

const MAX_TRIALS = 3;

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const imageCanvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000");
  const [brushSize, setBrushSize] = useState(2);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [eraserMode, setEraserMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lineArtImages, setLineArtImages] = useState([]);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("Neon Punk");
  const [isMobileView, setIsMobileView] = useState(false);
  const [remainingTrials, setRemainingTrials] = useState(MAX_TRIALS);
  const navigate = useNavigate();
  const { setCanvasDrawingUrl, setUploadedImageUrl } = useContext(ImageContext);

  const handleStyleSelect = (style) => setSelectedStyle(style);

  /* Keep canvases visually synced when images move */
  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);

  /* Desktop guard */
  useEffect(() => {
    const checkScreenSize = () => setIsMobileView(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /* Drawing handlers */
  const startDrawing = (x, y) => {
    if (isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = eraserMode ? brushSize * 15 : brushSize;
    context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor;
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };
  const draw = (x, y) => {
    if (!isDrawing || isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.stroke();
  };
  const stopDrawing = () => setIsDrawing(false);

  /* Get accurate canvas coordinates */
  const getCanvasCoordinates = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  /* Mouse & touch bindings */
  const handleTouchStart = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const coords = getCanvasCoordinates(t.clientX, t.clientY);
    startDrawing(coords.x, coords.y);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const coords = getCanvasCoordinates(t.clientX, t.clientY);
    draw(coords.x, coords.y);
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };
  const handleMouseDown = (e) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    startDrawing(coords.x, coords.y);
  };
  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    draw(coords.x, coords.y);
  };
  const handleMouseUp = () => stopDrawing();

  /* Image drag within image canvas */
  const handleImageDragStart = (mouseX, mouseY) => {
    lineArtImages.forEach((image, index) => {
      if (
        mouseX >= image.position.x &&
        mouseX <= image.position.x + image.size.width &&
        mouseY >= image.position.y &&
        mouseY <= image.position.y + image.size.height
      ) {
        setCurrentImageIndex(index);
        setIsDraggingImage(true);
        setDragOffset({
          x: mouseX - image.position.x,
          y: mouseY - image.position.y,
        });
      }
    });
  };
  const handleMouseMoveImage = (e) => {
    if (!isDraggingImage || currentImageIndex === null) return;
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    const updated = [...lineArtImages];
    updated[currentImageIndex].position = {
      x: coords.x - dragOffset.x,
      y: coords.y - dragOffset.y,
    };
    setLineArtImages(updated);
  };
  const handleMouseDownImage = (e) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    let found = false;
    lineArtImages.forEach((image, index) => {
      if (
        coords.x >= image.position.x &&
        coords.x <= image.position.x + image.size.width &&
        coords.y >= image.position.y &&
        coords.y <= image.position.y + image.size.height
      ) {
        setCurrentImageIndex(index);
        setIsDraggingImage(true);
        setDragOffset({
          x: coords.x - image.position.x,
          y: coords.y - image.position.y,
        });
        found = true;
      }
    });
    if (!found) setCurrentImageIndex(null);
  };
  const handleMouseUpImage = () => setIsDraggingImage(false);
  const handleTouchStartImage = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const coords = getCanvasCoordinates(t.clientX, t.clientY);
    handleImageDragStart(coords.x, coords.y);
  };
  const handleTouchMoveImage = (e) => {
    e.preventDefault();
    if (!isDraggingImage || currentImageIndex === null) return;
    const t = e.touches[0];
    const coords = getCanvasCoordinates(t.clientX, t.clientY);
    const updated = [...lineArtImages];
    updated[currentImageIndex].position = {
      x: coords.x - dragOffset.x,
      y: coords.y - dragOffset.y,
    };
    setLineArtImages(updated);
  };
  const handleTouchEndImage = () => setIsDraggingImage(false);

  const clearCanvas = () => {
    const d = canvasRef.current,
      dc = d.getContext("2d");
    const i = imageCanvasRef.current,
      ic = i.getContext("2d");
    dc.clearRect(0, 0, d.width, d.height);
    ic.clearRect(0, 0, i.width, i.height);
    setLineArtImages([]);
  };

  const mergeCanvases = () => {
    const i = imageCanvasRef.current;
    const d = canvasRef.current;
    const dc = d.getContext("2d");
    dc.drawImage(i, 0, 0);
  };

  const canvasToBlob = async () =>
    new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject(new Error("Canvas missing"));
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")),
        "image/png"
      );
    });

  const fetchImageBlob = async (url) =>
    (await axios.get(url, { responseType: "blob" })).data;

  const uploadGeneratedImageToSupabase = async (blob) => {
    try {
      const fileName = `generated_art_${Date.now()}.png`;
      const { error } = await supabase.storage
        .from("art")
        .upload(`images/${fileName}`, blob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error.message);
        return null;
      }

      const publicURL = `https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/art/images/${fileName}`;

      // Try to save URL to database (optional - if table exists)
      const { error: insertError } = await supabase
        .from("art")
        .insert([{ url: publicURL }]);

      if (insertError) {
        console.log("Note: Generated image saved to storage but not database (table might not exist)");
      } else {
        console.log("Generated image saved to both storage and database");
      }

      return publicURL;
    } catch (error) {
      console.error("Error uploading generated image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedStyle) {
      alert("Please select a style.");
      return;
    }
    if (remainingTrials <= 0) {
      alert("Trial limit reached!");
      return;
    }
    setLoading(true);
    try {
      // Check if canvas ref is available
      if (!canvasRef.current) {
        console.error("Canvas ref is null!");
        alert("Canvas not ready. Please try again.");
        setLoading(false);
        return;
      }

      mergeCanvases();

      // Get displayed canvas dimensions
      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();
      const displayedWidth = Math.round(canvasRect.width);
      const displayedHeight = Math.round(canvasRect.height);

      // Create a new canvas with white background using DISPLAYED dimensions
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = displayedWidth;
      tempCanvas.height = displayedHeight;
      const tempCtx = tempCanvas.getContext('2d');

      // Fill with white background
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas scaled to displayed size
      tempCtx.drawImage(canvas, 0, 0, displayedWidth, displayedHeight);

      const canvasDrawingUrl = canvas.toDataURL("image/png");

      // Convert the temp canvas (with white bg) to blob for AI
      const imageBlob = await new Promise((resolve) => {
        tempCanvas.toBlob(resolve, "image/png");
      });

      // Convert blob to base64
      const reader = new FileReader();
      const base64Image = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageBlob);
      });

      const prompt = `Sketch to real art. Style: ${selectedStyle}`;

      // Debug canvas content
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some((pixel, index) =>
        index % 4 !== 3 && pixel !== 255 // Check for non-white pixels (excluding alpha channel)
      );

      // Debug canvas content and dimensions
      const displayedAspectRatio = displayedWidth / displayedHeight;

      console.log("Canvas has drawing content:", hasContent);
      console.log("Canvas INTERNAL resolution:", canvas.width, "x", canvas.height);
      console.log("Canvas DISPLAYED size:", displayedWidth.toFixed(0), "x", displayedHeight.toFixed(0));
      console.log("Canvas internal aspect ratio:", (canvas.width / canvas.height).toFixed(2));
      console.log("Canvas displayed aspect ratio:", displayedAspectRatio.toFixed(2));
      console.log("Temp canvas dimensions:", tempCanvas.width, "x", tempCanvas.height);
      console.log("Temp canvas aspect ratio:", (tempCanvas.width / tempCanvas.height).toFixed(2));
      console.log("Sending to Gemini API with prompt:", prompt);
      console.log("Image data length:", base64Image.length);
      console.log("Base64 sample (first 100 chars):", base64Image.substring(0, 100));

      // Additional debugging
      if (!hasContent) {
        console.warn("⚠️ WARNING: Canvas appears to be empty! This might cause blank output.");
      }
      if (base64Image.length < 1000) {
        console.warn("⚠️ WARNING: Image data is very small, might be empty canvas.");
      }

      // Initialize Google GenAI
      const genAI = new GoogleGenerativeAI("AIzaSyDwsZ-_NmnEFnB9nn3a6qe8FHPVVSpEZSk");

      // Use the correct model for image generation
      const modelName = "gemini-2.5-flash-image-preview";
      console.log("Using model:", modelName);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          candidateCount: 1
        }
      });

      // Format request for Gemini SDK
      const requestPayload = [
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/png"
          }
        }
      ];

      console.log("Sending to Gemini API:", {
        prompt: prompt,
        hasImageData: !!base64Image,
        imageDataLength: base64Image.length
      });

      const response = await model.generateContent(requestPayload);

      console.log("Gemini API response:", response);

      // Access the nested response structure
      const candidates = response.response.candidates;
      console.log("Response candidates:", candidates);
      console.log("Number of candidates:", candidates?.length || 0);

      // Check if response has the expected structure
      if (!candidates || candidates.length === 0) {
        console.error("No candidates in response");
        alert("No image generated. Please try again.");
        return;
      }

      if (!candidates[0].content || !candidates[0].content.parts) {
        console.error("No content parts in response");
        alert("No image generated. Please try again.");
        return;
      }

      // Process the response
      console.log("Processing response parts...");
      console.log("Parts available:", candidates[0].content.parts?.length || 0);

      for (const part of candidates[0].content.parts) {
        console.log("Processing part:", part);
        console.log("Part has inlineData:", !!part.inlineData);
        console.log("Part has text:", !!part.text);

        if (part.text) {
          console.log("Part text content:", part.text);
        }

        if (part.inlineData) {
          const generatedImageData = part.inlineData.data;
          console.log("Found inline image data, length:", generatedImageData?.length || 0);

          // Convert base64 to blob
          const binaryString = atob(generatedImageData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const generatedBlob = new Blob([bytes], { type: 'image/png' });

          // Create a local URL for immediate display
          const localImageUrl = URL.createObjectURL(generatedBlob);
          console.log("Generated image blob URL:", localImageUrl);

          // Save the generated image to Supabase
          console.log("Saving generated image to Supabase...");
          const supabaseUrl = await uploadGeneratedImageToSupabase(generatedBlob);

          setCanvasDrawingUrl(canvasDrawingUrl);

          // Use Supabase URL if successful, otherwise use local URL
          const finalImageUrl = supabaseUrl || localImageUrl;
          setUploadedImageUrl(finalImageUrl);

          console.log("Final image URL:", finalImageUrl);
          console.log("Navigating to result page...");

          navigate("/result", {
            state: { canvasDrawingUrl, uploadedImageUrl: finalImageUrl },
          });
          return;
        }
      }

      console.error("❌ No inline image data found in any response parts");
      console.log("Available response structure:", JSON.stringify(response, null, 2));
      alert("No image generated. The AI might have returned text instead of an image. Please try again.");
    } catch (e) {
      console.error("Submit error details:", e);
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
      alert(`Failed to generate image: ${e.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };


  const toggleEraser = () => setEraserMode((v) => !v);

  const handleLineArtSelect = (lineArt) => {
    const canvas = imageCanvasRef.current;
    const w = canvas.width,
      h = canvas.height;
    const newLineArt = {
      src: lineArt.src,
      text: lineArt.text,
      position: { x: w / 4, y: h / 4 },
      size: {
        width: Math.random() * (w / 4) + w / 4,
        height: Math.random() * (h / 4) + h / 4,
      },
    };
    setLineArtImages((prev) => [...prev, newLineArt]);
  };

  const drawAllImages = () => {
    const c = imageCanvasRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    lineArtImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = () =>
        ctx.drawImage(
          img,
          image.position.x,
          image.position.y,
          image.size.width,
          image.size.height
        );
    });
  };

  const handleResizeImage = (e) => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return;
    const updated = [...lineArtImages];
    const newSize = parseInt(e.target.value, 10);
    updated[currentImageIndex].size = { width: newSize, height: newSize };
    setLineArtImages(updated);
  };

  const handleDeleteImage = () => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return;
    const updated = [...lineArtImages];
    updated.splice(currentImageIndex, 1);
    setLineArtImages(updated);
    setCurrentImageIndex(null);
  };


  /* Prevent swipe navigation gestures and context menu globally */
  useEffect(() => {
    const preventSwipeNavigation = (e) => {
      // Prevent horizontal swipe gestures that trigger browser navigation
      if (e.touches && e.touches.length === 1) {
        const touch = e.touches[0];
        const startX = touch.clientX;

        const handleTouchMove = (moveEvent) => {
          if (moveEvent.touches && moveEvent.touches.length === 1) {
            const moveTouch = moveEvent.touches[0];
            const deltaX = Math.abs(moveTouch.clientX - startX);
            const deltaY = Math.abs(moveTouch.clientY - touch.clientY);

            // If horizontal movement is greater than vertical, prevent default
            if (deltaX > deltaY && deltaX > 50) {
              moveEvent.preventDefault();
            }
          }
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchend', handleTouchEnd);
      }
    };

    // Prevent context menu on right-click and two-finger tap
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent two-finger tap context menu specifically
    const preventTwoFingerTap = (e) => {
      if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('touchstart', preventSwipeNavigation, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('touchstart', preventTwoFingerTap, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipeNavigation);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('touchstart', preventTwoFingerTap);
    };
  }, []);

  return (
    <>
      {loading && (
        <div>
          <video
            src="02.mp4"
            autoPlay
            loop
            muted
            style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          />
        </div>
      )}
      {!loading && (
        <div className="mainContainer">
          {isMobileView ? (
            <div className="mobileView">
              <h2>For a better experience, please switch to a desktop view!</h2>
            </div>
          ) : (
            <>
              {/* LEFT */}
              <div className="mainLeft">
                <div className="canvasContainer">
                  <canvas
                    ref={imageCanvasRef}
                    className="canvasgg"
                    width="1280"
                    height="500"
                    onMouseDown={(e) => {
                      const coords = getCanvasCoordinates(e.clientX, e.clientY);
                      handleImageDragStart(coords.x, coords.y);
                    }}
                    onMouseMove={handleMouseMoveImage}
                    onMouseUp={handleMouseUpImage}
                  />

                  <canvas
                    ref={canvasRef}
                    className="canvasff"
                    width="1280"
                    height="500"
                    onMouseDown={(e) => {
                      handleMouseDown(e);
                      handleMouseDownImage(e);
                    }}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      handleMouseMoveImage(e);
                    }}
                    onMouseUp={() => {
                      handleMouseUp();
                      handleMouseUpImage();
                    }}
                    onTouchStart={(e) => {
                      handleTouchStart(e);
                      handleTouchStartImage(e);
                    }}
                    onTouchMove={(e) => {
                      handleTouchMove(e);
                      handleTouchMoveImage(e);
                    }}
                    onTouchEnd={() => {
                      handleTouchEnd();
                      handleTouchEndImage();
                    }}
                  />
                </div>

                <div className="downContainer">
                  <div className="brushRest">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={brushSize}
                      onChange={(e) =>
                        setBrushSize(parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                  <div className="bothGContainer">
                    <button
                      onClick={() => setEraserMode(false)}
                      className={`brushButton brush ${
                        !eraserMode ? "active" : ""
                      }`}
                    >
                      <img src="/brush.svg" alt="brush" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                      Brush
                    </button>

                    <button
                      onClick={() => setEraserMode(true)}
                      className={`brushButton eraser ${
                        eraserMode ? "active" : ""
                      }`}
                    >
                      <img src="/erase.svg" alt="eraser" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                      Eraser
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="mainRight">
                <LineArtSelector
                  onLineArtSelect={(img) =>
                    setLineArtImages((p) => [
                      ...p,
                      {
                        ...img,
                        position: { x: 50, y: 50 },
                        size: { width: 180, height: 120 },
                      },
                    ])
                  }
                />
                <div className="imageResize-container">
                  <h3>Adjust Shape Size</h3>
                  <div className="imageResize-con">
                    <input
                      type="range"
                      min="60"
                      max="800"
                      onChange={handleResizeImage}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className="whole-style-container">
                  <h2>SELECT STYLE</h2>
                  <div className="style-container">
                    {[
                      "Neon Punk",
                      "Hyperrealism",
                      "Comic Book",
                      "Digital Art",
                    ].map((s) => {
                      const isActive = selectedStyle === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleStyleSelect(s)}
                          className={`style-box ${isActive ? "is-active" : ""}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="submit">
                  <button
                    className="buttonGG-rf submitBtn"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="resetButton resetBtn"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default DrawingApp;
