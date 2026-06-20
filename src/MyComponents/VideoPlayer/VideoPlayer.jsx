import React, { useEffect, useRef, useState } from "react";
import "./VideoPlayer.css";
import Video from "../../assetes/video.mp4";

const VideoPlayer = ({ playstate, setPlaystate }) => {
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const closePlayer = (e) => {
    if (e.target === overlayRef.current) {
      setPlaystate(false);
    }
  };

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasStarted(true);
    video.muted = false;
    video.play();
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
      setHasStarted(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
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
          aria-label="Close Video"
        >
          ×
        </button>

        {!hasStarted && (
          <button
            className="video-play-overlay"
            onClick={startPlayback}
            aria-label="Play Video"
          >
            <span className="video-play-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="video-play-label">Watch Video</span>
          </button>
        )}

        <video
          ref={videoRef}
          src={Video}
          controls={hasStarted}
          playsInline
          preload="metadata"
          muted
          style={{ opacity: hasStarted ? 1 : 0.001 }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
