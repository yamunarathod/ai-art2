import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient"; // Import Supabase client
import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Loading from "./Loading";

const DrawingApp = () => {
  const canvasRef = useRef(null); // Drawing canvas
  const imageCanvasRef = useRef(null); // Image canvas

  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState("Sunset with Mountains"); // Selected text prompt
  const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
  const [selectedSubPrompt, setSelectedSubPrompt] = useState(""); // Final selected sub-prompt
  const [finalPrompt, setFinalPrompt] = useState(""); // Final prompt combining prompt + line art text
  const [style, setStyle] = useState("Fantasy Art"); // Default style
  const [brushColor, setBrushColor] = useState("#000"); // Default brush color (black)
  const [brushSize, setBrushSize] = useState(1); // Default brush size
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
  const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
  const [loading, setLoading] = useState(false);
  const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images
  const navigate = useNavigate(); // For navigation to result page
  const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized
  const [selectedStyle, setSelectedStyle] = useState("Fantasy Art"); // Track the selected style

  const handleStyleSelect = (style) => {
    setSelectedStyle(style); // Update the selected style
  };


  // Redraw the canvas when the position or size of any image changes
  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);

  useEffect(() => {
    updateFinalPrompt();
  }, [lineArtImages, selectedSubPrompt]);


  // Mouse or touch events for canvas drawing
  const startDrawing = (x, y) => {
    if (isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round"; // Makes the line round at the edges
    context.lineJoin = "round"; // Smooth joins between lines
    context.lineWidth = brushSize;
    context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor; // Eraser or brush color
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

  const stopDrawing = () => {
    setIsDrawing(false);
    // saveCanvasState();
  };

  // Touch event handling for drawing
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  // Mouse event handling for drawing
  const handleMouseDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    startDrawing(x, y);
  };

  const handleMouseMove = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    draw(x, y);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };


  // Image drag and drop functionality for the image canvas (line art)
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
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    const updatedImages = [...lineArtImages];
    updatedImages[currentImageIndex].position = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };
    setLineArtImages(updatedImages);
  };

  // Handle touch events for dragging images
  const handleTouchStartImage = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    handleImageDragStart(mouseX, mouseY);
  };

  const handleTouchMoveImage = (e) => {
    if (!isDraggingImage || currentImageIndex === null) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    const updatedImages = [...lineArtImages];
    updatedImages[currentImageIndex].position = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };
    setLineArtImages(updatedImages);
  };

  const handleTouchEndImage = () => {
    setIsDraggingImage(false);
  };


  // Clear both canvases
  const clearCanvas = () => {
    const drawingCanvas = canvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    const imageCanvas = imageCanvasRef.current;
    const imageContext = imageCanvas.getContext("2d");

    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    setLineArtImages([]);
    setFinalPrompt("");
  };


  // Add this function to merge both canvases
  const mergeCanvases = () => {
    const imageCanvas = imageCanvasRef.current;
    const drawingCanvas = canvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");

    // Draw the imageCanvas content onto the drawingCanvas
    drawingContext.drawImage(imageCanvas, 0, 0);
  };

  // Convert canvas to Blob
  const canvasToBlob = async () => {
    const canvas = canvasRef.current;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  // Fetch the image from a URL and convert it to Blob
  const fetchImageBlob = async (imageUrl) => {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    return response.data;
  };

  const uploadToSupabase = async (blob) => {
    console.log("Uploading image to Supabase..."); // Debugging check
    const fileName = `generated_${Date.now()}.png`; // Unique file name
    const { data, error } = await supabase.storage
      .from("images/gurgaon") // Ensure this is your bucket name
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const publicURL = `https://qwwolplytjytipjvooru.supabase.co/storage/v1/object/public/images/gurgaon/${fileName}`;
    const { error: insertError } = await supabase
      .from("images")
      .insert([{ url: publicURL }]);

    if (insertError) {
      console.error("Insert error:", insertError);
    }
    return publicURL;
  };

  // Handle sending the prompt, style, and image data to the FastAPI backend
  const handleSubmit = async () => {
    if (!finalPrompt || !style) {
      alert(
        "Please select a sub-prompt and line art image, and draw something on the canvas!"
      );
      return;
    }
    setLoading(true); // Start showing the loading screen

    try {
      // Convert the canvas to base64 for displaying in the result page
      const canvas = canvasRef.current;

      if (!canvas) {
        console.error("Canvas not found!"); // Debugging check
        return;
      }

      mergeCanvases();

      const canvasDrawingUrl = canvas.toDataURL("image/png"); // Get the canvas image as base64
      console.log("Canvas Drawing URL:", canvasDrawingUrl); // Debugging check

      console.log("Final Prompt:", finalPrompt);
      // Send the canvas image and prompt data to the FastAPI backend
      const imageBlob = await canvasToBlob();
      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", style);
      formData.append("image", imageBlob, "drawing.png"); // Sending image as a binary Blob

      const response = await axios.post(
        "http://localhost:5000/generate-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const imageUrl = response.data.image_url;

        // Ensure the imageUrl has the correct format
        const generatedUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `http://localhost:5000/${imageUrl}`;
        setGeneratedImageUrl(generatedUrl); // Set the URL of the generated image

        // Fetch the generated image as Blob from the backend URL
        const generatedImageBlob = await fetchImageBlob(generatedUrl);

        // Upload the fetched image Blob to Supabase
        const supabaseUrl = await uploadToSupabase(generatedImageBlob);

        if (supabaseUrl) {
          console.log("Image uploaded to Supabase, URL:", supabaseUrl); // Debugging
          console.log("Navigating to result page"); // Debugging before navigation
          navigate("/result", {
            state: { canvasDrawingUrl, uploadedImageUrl: supabaseUrl },
          });
          console.log("Navigation triggered"); // Debugging after navigation
        }
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    switch (selectedPrompt) {
      case "Sunset with Mountains":
        setSubPrompts([
          "Sunset with Mountains",
          "Blooming in a Meadow",
          "Snow-capped Peaks at Dawn",
          "River with Cascading Waterfalls",
          "Sunset with reflections",
        ]);
        break;
      case "Space":
        setSubPrompts([
          "With Moons and Asteroids",
          "Spiral Galaxy with Stars",
          "Colliding Galaxies",
          "Docked at a Space Station",
          "Galaxy with Star Trails",
        ]);
        break;
      case "Automibile":
        setSubPrompts([
          "With a City Skyline",
          "Racing on a track",
          "With a Mountain Backdrop",
          "In a Rustic Farmyard",
          "Racing Through Urban Streets",
        ]);
        break;
      case "Animal":
        setSubPrompts([
          "resting under the shade of a large tree in the savanna",
          "splashing water in a calm river with its trunk.",
          "sprinting across the open plains in pursuit of prey.",
          "waddling across icy terrain with its chick.",
          "howling at the full moon in a dark forest.",
        ]);
        break;
      default:
        setSubPrompts([]);
    }
    setSelectedSubPrompt(""); // Reset sub-prompt selection
  };

  // Handle selecting sub-prompt and updating the final prompt
  const handleSubPromptSelect = (subPrompt) => {
    setSelectedSubPrompt(subPrompt);
  };

  // Update the final prompt with the selected sub-prompt and all the line art text
  const updateFinalPrompt = () => {
    if (!selectedSubPrompt) return;

    const lineArtText = lineArtImages.map((img) => img.text).join(" and ");
    setFinalPrompt(`${lineArtText}, ${selectedSubPrompt}`);
  };

  // Handle selecting style
  //   const handleStyleSelect = (style) => {
  //     setStyle(style);
  //   };

  // Toggle eraser mode
  const toggleEraser = () => {
    setEraserMode(!eraserMode);
  };

  // Line art selection and placement
  const handleLineArtSelect = (lineArt) => {
    const canvas = imageCanvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const newLineArt = {
      src: lineArt.src,
      text: lineArt.text,
      position: { x: canvasWidth / 4, y: canvasHeight / 4 },
      size: {
        width: Math.random() * (canvasWidth / 4) + canvasWidth / 4,
        height: Math.random() * (canvasHeight / 4) + canvasHeight / 4,
      },
    };

    setLineArtImages([...lineArtImages, newLineArt]);
  };

  // Draw all line art images on the image canvas
  const drawAllImages = () => {
    const canvas = imageCanvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    lineArtImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        context.drawImage(
          img,
          image.position.x,
          image.position.y,
          image.size.width,
          image.size.height
        );
      };
    });
  };

  // Handle dragging the image inside the canvas
  const handleMouseDownImage = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let imageFound = false;
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
        imageFound = true;
      }
    });

    // If no image is selected, deselect any current image
    if (!imageFound) {
      setCurrentImageIndex(null);
    }
  };

  const handleMouseUpImage = () => {
    setIsDraggingImage(false);
  };

  // Handle resizing the image
  const handleResizeImage = (e) => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    const newSize = parseInt(e.target.value, 10);
    updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
    setLineArtImages(updatedImages);
  };

  // Handle deleting the selected image
  const handleDeleteImage = () => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    updatedImages.splice(currentImageIndex, 1); // Remove the selected image
    setLineArtImages(updatedImages); // Update the state
    setCurrentImageIndex(null); // Deselect the image after deleting
  };

  // Automatically select the default prompt when the component loads
  useEffect(() => {
    handlePromptSelect("Sunset with Mountains"); // Set the default active prompt
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
            style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
          ></video>
        </div>
      )}
      {!loading && (
        <div style={{ display: "block" }}>
          {loading ? (
            <Loading />
          ) : (
            <div className="mainContainer">
              <div className="mainLeft">
                <div className="canvasContainer">

                  <canvas
                    ref={imageCanvasRef}
                    width="1192"
                    height="650"
                    onMouseDown={(e) => handleImageDragStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    onMouseMove={handleMouseMoveImage}
                    onMouseUp={handleMouseUpImage}
                    style={{
                      position: "absolute",
                      zIndex: 1, // Lower z-index to be below drawing
                      top: 0,
                      left: 76,
                      backgroundColor: "white"
                    }}
                  ></canvas>
                  <canvas
                    ref={canvasRef}
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
                    width="1192"
                    height="650"
                    style={{
                      border: "1px solid black",
                      zIndex: 2,
                      // Transparent background
                      backgroundColor: "transparent"
                      // backgroundColor:"red"
                    }}
                  ></canvas>
                </div>
                <div className="downContainer">
                  <div className="brushRest">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={brushSize}
                      className="slider-thumb"
                      onChange={(e) => setBrushSize(e.target.value)}
                    />
                  </div>
                  <div className="bothGContainer">
                    <button onClick={toggleEraser} className="brushButton">
                      {eraserMode ? "Brush" : "Eraser"}
                    </button>
                    <button onClick={clearCanvas} className="resetButton">
                      <img src="/public/e-icon.svg" alt="" />
                      <p>Reset</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mainRight">
                {/* Line Art Selector */}
                <LineArtSelector onLineArtSelect={handleLineArtSelect} />

                {/* Image Resize and Delete Controls */}
                <div style={{ width: "100%", marginBottom: "16px" }}>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 16,
                      paddingBottom: 16,
                    }}
                  >
                    ADJUST SIZE
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <div
                      style={{
                        width: "65%",
                        border: "1px solid #fff",
                        padding: "14px",
                        borderRadius: "8px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        // height: "47px",
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >

                      <input

                        type="range"
                        min="50"
                        max="500"
                        value={
                          currentImageIndex !== null &&
                            lineArtImages[currentImageIndex]
                            ? lineArtImages[currentImageIndex]?.size?.width ||
                            100
                            : 100 // Default to 100 when no image is selected
                        }
                        onChange={handleResizeImage}
                        disabled={
                          currentImageIndex === null ||
                          !lineArtImages[currentImageIndex]
                        } // Disable the input when no image is selected
                      />
                    </div>
                    <div style={{}}>
                      <button
                        style={{
                          height: "47px",
                          backgroundColor: "transparent",
                          border: "1px solid #fff",
                          padding: "10 50px",
                          borderRadius: 10,
                          color: "white",
                          width: "140px",
                        }}
                        onClick={handleDeleteImage}
                        disabled={
                          currentImageIndex === null ||
                          !lineArtImages[currentImageIndex]
                        } // Disable the button when no image is selected
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className=""
                  style={{
                    width: "90%",
                    height: "1px",
                    backgroundColor: "#fff",
                    margin: "16px 0",
                  }}
                ></div>
                {/* Prompt Selection */}
                <h2
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: 16,
                    paddingBottom: 10,
                    paddingTop: 10,
                  }}
                >
                  SELECT THEME
                </h2>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "0px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: "0px" }}>
                      <div></div>
                      <div
                        onClick={() =>
                          handlePromptSelect("Sunset with Mountains")
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "40px",
                          width: "129px",
                          textAlign: "center",
                          border:
                            prompt === "Sunset with Mountains"
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          borderTopLeftRadius: "8px",
                          cursor: "pointer",
                          backgroundColor:
                            prompt === "Sunset with Mountains"
                              ? "#fff"
                              : "transparent",
                        }}
                      >
                        Nature
                      </div>

                      <div
                        onClick={() => handlePromptSelect("Space")}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "40px",
                          width: "129px",
                          border:
                            prompt === "With Moons and Asteroids"
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          borderRadius: "0px",
                          cursor: "pointer",
                          backgroundColor:
                            prompt === "With Moons and Asteroids"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Space
                      </div>

                      <div
                        onClick={() => handlePromptSelect("Automibile")}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "40px",
                          width: "129px",
                          border:
                            prompt === "With a City Skyline"
                              ? "2px solid #0F4ABA"
                              : "1px solid #ccc",
                          borderRadius: "0px",
                          cursor: "pointer",
                          backgroundColor:
                            prompt === "With a City Skyline"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Automobile
                      </div>
                      <div
                        onClick={() => handlePromptSelect("Animal")}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "129px",
                          height: "40px",
                          border:
                            prompt === "In a Neon-lit Cityscape"
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          borderTopRightRadius: "8px",
                          cursor: "pointer",
                          backgroundColor:
                            prompt === "In a Neon-lit Cityscape"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Animal
                      </div>
                    </div>
                  </div>

                  {/* Show more options based on selected prompt */}
                  {subPrompts.length > 0 && (
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0px",
                          width: "100%",
                        }}
                      >
                        {subPrompts.map((subPrompt, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedSubPrompt(subPrompt)}
                            style={{
                              padding: "0px 10px",
                              margin: "6px 6px",

                              border:
                                selectedSubPrompt === subPrompt
                                  ? "1px solid #0F4ABA"
                                  : "0px solid #ccc",

                              borderRadius:
                                selectedSubPrompt === subPrompt ? "7px" : "7px",

                              cursor: "pointer",
                              backgroundColor:
                                selectedSubPrompt === subPrompt
                                  ? "#EEEEEE"
                                  : "#FBFBFB",
                              color:
                                selectedSubPrompt === subPrompt
                                  ? "#0F4ABA"
                                  : "#0F4ABA",
                              fontWeight:
                                selectedSubPrompt === subPrompt ? "700" : "500",
                            }}
                          >
                            {subPrompt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


                <div className="whole-style-container">
                  <h2
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 16,
                      paddingBottom: 18,
                    }}
                  >
                    SELECT STYLE:
                  </h2>

                  <div
                    className="style-container"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    {/* Style Button 1 */}
                    <button
                      onClick={() => handleStyleSelect("Fantasy Art")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Fantasy Art"
                            ? "#fff"
                            : "transparent", // Change color if selected
                        color:
                          selectedStyle === "Fantasy Art" ? "#000" : "#fff",
                        padding: "10px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Fantasy Art
                    </button>

                    {/* Style Button 2 */}
                    <button
                      onClick={() => handleStyleSelect("Neon Punk")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Neon Punk"
                            ? "#fff"
                            : "transparent",
                        color: selectedStyle === "Neon Punk" ? "#000" : "#fff",
                        padding: "10px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Neon Punk
                    </button>

                    {/* Style Button 3 */}
                    <button
                      onClick={() => handleStyleSelect("Hyperrealism")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Hyperrealism"
                            ? "#fff"
                            : "transparent",
                        color:
                          selectedStyle === "Hyperrealism" ? "#000" : "#fff",
                        padding: "10px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Hyperrealism
                    </button>

                    {/* Style Button 4 */}
                    <button
                      onClick={() => handleStyleSelect("Comic Book")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Comic Book"
                            ? "#fff"
                            : "transparent",
                        color: selectedStyle === "Comic Book" ? "#000" : "#fff",
                        padding: "10px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Comic Book
                    </button>
                  </div>
                </div>

                <div
                  className=""
                  style={{
                    width: "90%",
                    height: "1px",
                    backgroundColor: "#fff",
                    margin: "30px 0",
                  }}
                ></div>

                {/* Submit Button */}
                <div
                  style={{
                    height: "90px",
                    width: "90%",
                    marginTop: "1px",
                    borderRadius: "16px",
                    border: "none",
                  }}
                >
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "16px",
                      border: "none",
                      fontSize: "25px",
                      fontWeight: "600",
                      color: "#0F4ABA",
                    }}
                  >
                    {loading ? "Generating..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DrawingApp;
