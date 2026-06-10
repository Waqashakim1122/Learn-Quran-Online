import React, { useRef } from 'react';
import './VideoPlayer.css';
import Video from '../../assetes/video.mp4'; 
const VideoPlayer = ({ playstate, setPlaystate }) => {
  const Player = useRef(null);

  const ClosePlayer = (e) => {
    if (e.target === Player.current) {
      setPlaystate(false);
    }
  };

  return (
    <div className={`Video-player ${playstate ? '' : 'hide'}`} ref={Player} onClick={ClosePlayer}>
      <video src={Video} autoPlay muted controls></video>
    </div>
  );
};

export default VideoPlayer;
