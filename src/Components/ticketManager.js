import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TicketEditor from "./ticketEditor";
import TicketDisplay from "./ticketDisplay";
import { fetchTicketById, submitTicket } from "../Services/ticketService";
import ColorThief from "colorthief";
import stampSoundPath from "../Tickets/stamp-sound.mp3";
const stampPath = require(`../Tickets/ticket-stamp2.png`); // Damga görseli

const TicketManager = () => {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f4f8");
  const [stampPosition, setStampPosition] = useState(null);
  const ticketImageRef = useRef(null);

  useEffect(() => {
    const loadTicket = async () => {
      const data = await fetchTicketById(ticketId);
      setTicketData(data);
    };

    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    if (ticketImageRef.current) {
      const img = ticketImageRef.current;
      const colorThief = new ColorThief();

      if (img.complete) {
        const color = colorThief.getColor(img);
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } else {
        img.addEventListener("load", () => {
          const color = colorThief.getColor(img);
          setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        });
      }
    }
  }, [ticketData]);

  const handleTouchStart = (event) => {
    if (!ticketData || ticketData.isStamped) return;

    if (event.touches.length === 3) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const touch3 = event.touches[2];

      const x = (touch1.clientX + touch2.clientX + touch3.clientX) / 3;
      const y = (touch1.clientY + touch2.clientY + touch3.clientY) / 3;

      setStampPosition({ x, y });

      const audio = new Audio(stampSoundPath);
      audio.play();

      handleStamp();
    }
  };

  const handleStamp = async () => {
    const updatedData = await submitTicket(ticketId);
    setTicketData(updatedData);
  };

  if (!ticketData) return null;

  const { owner, options } = ticketData;
  const color = options[0];
  const character = options[1];

  return (
    <div
      className="ticket-container"
      style={{ backgroundColor: bgColor }}
      onTouchStart={handleTouchStart}
    >
      {finalImage ? (
        <div>
          <TicketDisplay finalImage={finalImage} />
          {stampPosition && !ticketData.isStamped && (
            <div
              className="stamp-background animate-stamp"
              style={{
                top: `${stampPosition.y}px`,
                left: `${stampPosition.x}px`,
              }}
            >
              <img src={stampPath} alt="Stamp" className="stamp" />
            </div>
          )}
        </div>
      ) : (
        <TicketEditor
          owner={owner}
          color={color}
          character={character}
          onImageReady={setFinalImage}
          imgRef={ticketImageRef}
        />
      )}
    </div>
  );
};

export default TicketManager;
