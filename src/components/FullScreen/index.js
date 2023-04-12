import React, { useState } from "react";

const FullscreenToggle = ({ id }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.getElementById(id);

    if (!fullscreen) {
      // enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      element.classList.add("fullscreen-mode");
    } else {
      // exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      element.classList.remove("fullscreen-mode");
    }
    setFullscreen(!fullscreen);
  };

  return (
    <button onClick={toggleFullscreen}>
      {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  );
};

export default FullscreenToggle;
