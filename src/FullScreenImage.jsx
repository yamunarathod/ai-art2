import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ozkbnimjuhaweigscdby.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a2JuaW1qdWhhd2VpZ3NjZGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI4Nzg0NiwiZXhwIjoyMDY2ODYzODQ2fQ.V7tdyfLyCNL39tqlVBufAuvwHJciU8R2IRatu29dnLM";
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = "art";
const FOLDER = "images";
const PREFIX = `${FOLDER}/`;

export default function FullScreenImage() {
  const [imageUrl, setImageUrl] = useState(null);
  const lastSeenRef = useRef({ name: "", updatedAt: "" });
  const timerRef = useRef(null);

  useEffect(() => {
    let pollIntervalMs = 1000;

    const poll = async () => {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, {
          sortBy: { column: "updated_at", order: "desc" },
          limit: 1,
        });
        if (error) throw error;

        if (data && data.length) {
          const file = data[0];
          const fullPath = `${PREFIX}${file.name}`;

          const changed =
            file.name !== lastSeenRef.current.name ||
            file.updated_at !== lastSeenRef.current.updatedAt;

          if (changed) {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
            const freshUrl = `${urlData.publicUrl}?v=${Date.now()}`;

            setImageUrl(freshUrl);
            lastSeenRef.current = { name: file.name, updatedAt: file.updated_at };
          }
        }
      } catch (e) {
        console.error("Polling error:", e);
      } finally {
        const visible = document.visibilityState === "visible";
        const next = visible ? pollIntervalMs : Math.min(pollIntervalMs * 4, 10000);
        timerRef.current = setTimeout(poll, next);
      }
    };

    poll();

    const onVis = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(poll, document.visibilityState === "visible" ? 250 : 2000);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const containerStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 9999,
  };

  const imageStyle = { width: "100%", height: "100%", objectFit: "fill", objectPosition: "center" };

  return (
    <div style={containerStyle}>
      {imageUrl ? (
        <img src={imageUrl} alt="Latest uploaded image" style={imageStyle} />
      ) : (
        <p style={{ color: "white", fontSize: "2rem" }}>Loading image...</p>
      )}
    </div>
  );
}