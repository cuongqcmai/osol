import React from "react";
import imgLogo from "../public/images/66e85bdf146da60e77a5da90_66f6828d1d04ab09cb9049a4_Logo_rotated_coloured_v03-poster-00001.jpg";
const RotatingImage = () => {
  return (
    <div className="absolute rotating-background top-0 container">
      <img
        src={imgLogo.src} // Replace with your image URL
        alt="Rotating"
        className="rotating-image"
      />
    </div>
  );
};

export default RotatingImage;
