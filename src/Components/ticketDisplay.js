import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import { submitTicket } from "../Services/ticketService";

const TicketDisplay = ({ color, character, ticketId }) => {
  const imagePath = require(`../Tickets/${color}/${character}.png`);
  const stampPath = require("../Tickets/ticket-stamp.png"); // Damga görüntüsünün yolu
  const imgRef = useRef(null);
  const [bgColor, setBgColor] = useState("#f0f4f8"); // Varsayılan arka plan rengi
  const [stampPosition, setStampPosition] = useState(null); // Damga pozisyonu için durum

  const handleTouchStart = (event) => {
    if (event.touches.length === 3) {
      console.log("Üç parmakla basıldı, damga işlemi başlatılıyor...");
      const touch = event.touches[0]; // İlk dokunulan noktayı al
      const x = touch.clientX;
      const y = touch.clientY;

      setStampPosition({ x, y }); // Damganın konumunu kaydet
      handleStamp(); // Damga fonksiyonunu çağır
    }
  };

  const handleStamp = async () => {
    try {
      console.log(`Ticket ID: ${ticketId} için PUT isteği gönderiliyor...`);
      const result = await submitTicket(ticketId);
      console.log("Bilet başarıyla damgalandı:", result);
      alert("Bilet başarıyla kullanıldı!");
    } catch (error) {
      console.error("Bilet zaten kullanıldı veya başka bir hata oluştu:", error);
      alert(error.message || "Bilet zaten kullanıldı!");
    }
  };

  useEffect(() => {
    const colorThief = new ColorThief();

    const handleImageLoad = () => {
      if (imgRef.current) {
        const color = colorThief.getColor(imgRef.current);
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      }
    };

    if (imgRef.current.complete) {
      handleImageLoad();
    } else {
      imgRef.current.addEventListener("load", handleImageLoad);
      return () => imgRef.current.removeEventListener("load", handleImageLoad);
    }
  }, [imagePath]);

  return (
    <div
      className="ticket-container"
      style={{
        backgroundColor: bgColor,
      }}
      onTouchStart={handleTouchStart}
    >
      <img
        src={imagePath}
        alt={`${character} Ticket`}
        className="ticket-image"
        ref={imgRef}
        crossOrigin="anonymous"
      />
      {/* Damga görüntüsü */}
      {stampPosition && (
        <img
          src={stampPath}
          alt="Stamp"
          className="stamp"
          style={{
            top: stampPosition.y - 25, // Damganın merkezini konumlandır
            left: stampPosition.x - 25,
          }}
        />
      )}
    </div>
  );
};

export default TicketDisplay;
