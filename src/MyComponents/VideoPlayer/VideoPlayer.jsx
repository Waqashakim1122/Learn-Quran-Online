import React, { useEffect, useRef } from "react";
import "./VideoPlayer.css";
import Video from "../../assetes/video.mp4";

const VideoPlayer = ({ playstate, setPlaystate }) => {
  const overlayRef = useRef(null);

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

        <video
          src={Video}
          controls
          autoPlay
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
