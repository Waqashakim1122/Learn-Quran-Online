import React, { useEffect, useRef, useState } from "react";
import "./VideoPlayer.css";
import Video from "../../assetes/video.mp4";

const VideoPlayer = ({ playstate, setPlaystate }) => {
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const closePlayer = (e) => {
    if (e.target === overlayRef.current) {
      setPlaystate(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setPlaystate(false);
      }
    };
    if (playstate) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
      setLoading(true);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [playstate, setPlaystate]);

  return (
    <div
      className={`video-modal ${playstate ? "show" : ""}`}
      ref={overlayRef}
      onClick={closePlayer}
    >
      <div className="video-container">
        <button
          className="close-btn"
          onClick={() => setPlaystate(false)}
          aria-label="Close Video"
        >
          ×
        </button>

        {loading && (
          <div className="video-loading">
            <div className="video-spinner"></div>
            <span>Loading video...</span>
          </div>
        )}

        <video
          src={Video}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onCanPlay={() => setLoading(false)}
          onLoadedData={() => setLoading(false)}
          style={{ opacity: loading ? 0 : 1 }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
