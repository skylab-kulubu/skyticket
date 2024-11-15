import React, { useEffect, useRef } from "react";

const TicketEditor = ({ color, character, owner, onImageReady, imgRef }) => {
  const canvasRef = useRef(null);
  const imagePath = require(`../Tickets/${color}/${character}.png`);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.font = "40px Bebas Neue";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(`${owner.firstName} ${owner.lastName}`, canvas.width * 0.2, canvas.height * 0.6);

      const finalImage = canvas.toDataURL("image/png");
      onImageReady(finalImage);
    };
  }, [imagePath, owner, onImageReady]);

  return (
    <div className="ticket-container">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img ref={imgRef} src={imagePath} alt="Ticket" className="ticket-image" />
    </div>
  );
};

export default TicketEditor;
