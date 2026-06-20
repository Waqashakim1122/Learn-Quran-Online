import React, { useEffect, useRef, useState } from "react";
import "./VideoPlayer.css";
import Video from "../../assetes/video.mp4";

const VideoPlayer = ({ playstate, setPlaystate }) => {
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const closePlayer = (e) => {
    if (e.target === overlayRef.current) {
      setPlaystate(false);
    }
  };

  const hideLoading = () => setLoading(false);

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

      const video = videoRef.current;
      const checkPlaying = setInterval(() => {
        if (video && !video.paused && video.currentTime > 0) {
          hideLoading();
          clearInterval(checkPlaying);
        }
      }, 200);

      const fallbackTimer = setTimeout(hideLoading, 4000);

      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleEsc);
        clearInterval(checkPlaying);
        clearTimeout(fallbackTimer);
      };
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
          ref={videoRef}
          src={Video}
          controls
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={hideLoading}
          onCanPlayThrough={hideLoading}
          onLoadedData={hideLoading}
          onPlaying={hideLoading}
          onTimeUpdate={hideLoading}
          style={{ opacity: loading ? 0 : 1, position: "relative", zIndex: 2 }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
