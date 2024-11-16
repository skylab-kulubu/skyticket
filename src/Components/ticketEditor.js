import React, { useEffect, useRef } from "react";

const TicketEditor = ({ color, character, owner, onImageReady, imgRef }) => {
  const canvasRef = useRef(null);
  const imagePath = require(`../Tickets/${color}/${color}_${character}.png`);

  useEffect(() => {
    const loadFontAndRender = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imagePath;

      try {
        // Fontun tamamen yüklenmesini bekle
        await document.fonts.load("80px Bebas Neue");

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          // Görseli çiz
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Yazıyı ekle
          ctx.font = "80px Bebas Neue";
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          ctx.fillText(
            `${owner.firstName} ${owner.lastName}`,
            canvas.width * 0.13,
            canvas.height * 0.6
          );

          // Canvas'ı görüntüye dönüştür
          const finalImage = canvas.toDataURL("image/png");
          onImageReady(finalImage);
        };
      } catch (error) {
        console.error("Font yüklenirken hata oluştu:", error);
      }
    };

    loadFontAndRender();
  }, [imagePath, owner, onImageReady]);

  return (
    <div className="ticket-container">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img ref={imgRef} src={imagePath} alt="Ticket" className="ticket-image" />
    </div>
  );
};

export default TicketEditor;
