import React, { useEffect, useRef } from "react";
import "./VideoPlayer.css";
import Video from "../../assetes/video.mp4";

const VideoPlayer = ({ playstate, setPlaystate }) => {
  const overlayRef = useRef(null);
  const videoRef = useRef(null);

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
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
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
          aria-label="Close video"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <video
          ref={videoRef}
          src={Video}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
