import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
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
  const [prompt, setPrompt] = useState("Superhero");
  const [subPrompts, setSubPrompts] = useState([]);
  const [selectedSubPrompt, setSelectedSubPrompt] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");
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
  useEffect(() => {
    updateFinalPrompt();
  }, [lineArtImages, selectedSubPrompt]);

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
    setFinalPrompt("");
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

  const uploadToSupabase = async (blob) => {
    const fileName = `generated_${Date.now()}.png`;
    const { error } = await supabase.storage
      .from("art1")
      .upload(`gurgaon/${fileName}`, blob, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Upload error", error.message);
      return null;
    }
    const publicURL = `https://aczbckuwrnbidkncpkqf.supabase.co/storage/v1/object/public/art1/gurgaon/${fileName}`;
    const { error: insertError } = await supabase
      .from("art1")
      .insert([{ url: publicURL }]);
    if (insertError) console.error("Insert error", insertError);
    return publicURL;
  };

  const handleSubmit = async () => {
    if (!finalPrompt || !selectedStyle) {
      alert("Please select a sub-prompt, line art image, and a style.");
      return;
    }
    if (remainingTrials <= 0) {
      alert("Trial limit reached!");
      return;
    }
    setLoading(true);
    try {
      mergeCanvases();
      const canvas = canvasRef.current;
      const canvasDrawingUrl = canvas.toDataURL("image/png");
      const imageBlob = await canvasToBlob();
      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", selectedStyle);
      formData.append("image", imageBlob, "drawing.png");

      const response = await axios.post(
        "https://sea-turtle-app-vy9lk.ondigitalocean.app/generate-image/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.status === "success") {
        const imageUrl = response.data.image_url.startsWith("http")
          ? response.data.image_url
          : `https://sea-turtle-app-vy9lk.ondigitalocean.app/${response.data.image_url}`;
        const generatedBlob = await fetchImageBlob(imageUrl);
        const supabaseUrl = await uploadToSupabase(generatedBlob);
        setCanvasDrawingUrl(canvasDrawingUrl);
        setUploadedImageUrl(supabaseUrl);
        if (supabaseUrl)
          navigate("/result", {
            state: { canvasDrawingUrl, uploadedImageUrl: supabaseUrl },
          });
      } else {
        console.error("Backend error:", response.data.message);
      }
    } catch (e) {
      console.error("Submit error", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (selected) => {
    setPrompt(selected);
    switch (selected) {
      case "Space":
        setSubPrompts([
          "Astronaut floating near a space station.",
          "Ringed planet with giant orbiting moons",
          "Explorer on alien planet",
          "Asteroid impacting a barren moon",
        ]);
        break;
      case "Superhero":
        setSubPrompts([
          "Dynamic hero flying over city",
          "Vigilante leaping across dark rooftops",
          "Cosmic hero surfing a nebula",
          "Superhero team in epic battle",
        ]);
        break;
      case "Automobiles":
        setSubPrompts([
          "Classic muscle car racing down highway",
          "Jumbo jet taking off from runway.",
          "Cargo ship crossing the ocean.",
          "Off-road adventure through rugged terrain",
        ]);
        break;
      case "Anime":
        setSubPrompts([
          "Magical girl casting spells in moonlight",
          "Mecha warrior defending Tokyo skyline",
          "Samurai dueling in cherry blossom garden",
          "School students discovering hidden powers",
        ]);
        break;
      default:
        setSubPrompts([]);
    }
    setSelectedSubPrompt("");
  };

  const handleSubPromptSelect = (p) => setSelectedSubPrompt(p);

  const updateFinalPrompt = () => {
    if (!selectedSubPrompt) return;
    const lineArtText = lineArtImages.map((img) => img.text).join(" and ");
    setFinalPrompt(`${lineArtText}, ${selectedSubPrompt}`);
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

  useEffect(() => {
    handlePromptSelect("Superhero");
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
                <h2 className="clasgg-h2">SELECT THEME</h2>
                <div className="theme">
                  <div className="mainthemcont">
                    <div className="oggng">
                      {["Superhero", "Space", "Automobiles", "Anime"].map((item) => {
                        const isActive = prompt === item;
                        return (
                          <div
                            key={item}
                            onClick={() => handlePromptSelect(item)}
                            className={`selecttheme-box ${
                              isActive ? "is-active" : ""
                            }`}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>

                    {subPrompts.length > 0 && (
                      <div className="sub-prompts-contaier-main">
                        <div className="sub-prompts-contaier-ff">
                          {subPrompts.map((sp) => (
                            <div
                              key={sp}
                              onClick={() => setSelectedSubPrompt(sp)}
                              className={`sub-prompts-oopp ${
                                selectedSubPrompt === sp ? "is-active" : ""
                              }`}
                            >
                              {sp}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
