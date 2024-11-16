import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TicketEditor from "./ticketEditor";
import TicketDisplay from "./ticketDisplay";
import { fetchTicketById, submitTicket } from "../Services/ticketService";
import ColorThief from "colorthief";
import stampSoundPath from "../Tickets/stamp-sound.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const stampPath = require(`../Tickets/ticket-stamp2.png`); // Damga görseli

const CHARACTER_ENUMS = new Set([
  "DEADPOOL",
  "YODA",
  "FINN",
  "JAKE",
  "SPIDERMAN",
  "RICK",
  "HARLEY_QUINN",
  "SUNGER_BOB",
  "RIGBY_VE_MORDECAI",
  "WONDER_WOMAN",
  "SCOOBY_DOO",
  "HARRY_POTTER",
  "BATMAN",
  "IRON_MAN",
  "JOKER",
  "PRENSES_CIKLET",
  "WOODY",
  "THANOS",
  "GWEN_STACY",
  "SUPERMAN",
  "WOLVERINE",
  "HULK",
]);

const COLOR_ENUMS = new Set(["YESIL", "MAVI", "KIRMIZI", "MOR"]);

const TicketManager = () => {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f4f8");
  const [stampPosition, setStampPosition] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const ticketImageRef = useRef(null);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetchTicketById(ticketId);
        if (response.success) {
          setTicketData(response.data);
          if (response.data.used) {
            //setPopupVisible(true);
          }
        } else {
          console.error("Failed to fetch ticket:", response.message);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    if (ticketImageRef.current) {
      const img = ticketImageRef.current;
      const colorThief = new ColorThief();

      if (img.complete) {
        const color = colorThief.getColor(img);
        const bg = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        setBgColor(bg);
        document.body.style.backgroundColor = bg;
      } else {
        img.addEventListener("load", () => {
          const color = colorThief.getColor(img);
          const bg = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          setBgColor(bg);
          document.body.style.backgroundColor = bg;
        });
      }
    }
  }, [ticketData]);

  const getPopupMessage = () => {
    if (!ticketData || !ticketData.event || !ticketData.owner) {
      return "Bilgiler yükleniyor...";
    }

    const { name: eventName } = ticketData.event;
    const { firstName, lastName } = ticketData.owner;
    return `${
      eventName || "Etkinlik"
    } etkinliğine hoş geldiniz, ${firstName} ${lastName}!`;
  };

  const renderPopup = () => {
    if (!popupVisible) return null;
    return (
      <div className="popup">
        <p>{getPopupMessage()}</p>
      </div>
    );
  };

  const handleStamp = async () => {
    try {
      const response = await submitTicket(ticketId);
      if (response.success) {
        setTicketData(response.data);
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  const handleTouchStart = (event) => {
    if (!ticketData || ticketData.used) return;

    if (event.touches.length === 3) {
      const [touch1, touch2, touch3] = event.touches;

      const x = (touch1.clientX + touch2.clientX + touch3.clientX) / 3;
      const y = (touch1.clientY + touch2.clientY + touch3.clientY) / 3;

      setStampPosition({ x, y });

      const audio = new Audio(stampSoundPath);
      audio.play();

      handleStamp();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      handleStamp();
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [ticketData]);

  const getCharacterAndColor = (options) => {
    let character = null;
    let color = null;

    options.forEach((option) => {
      if (CHARACTER_ENUMS.has(option)) {
        character = option;
      } else if (COLOR_ENUMS.has(option)) {
        color = option;
      }
    });

    return { character, color };
  };

  const downloadTicket = () => {
    if (finalImage) {
      const link = document.createElement("a");
      link.href = finalImage;
      link.download = "ticket.png";
      link.click();
    }
  };

  if (!ticketData) return <p>BİLET YÜKLENİYOR...</p>;

  const { owner, options, used } = ticketData;
  const { character, color } = getCharacterAndColor(options);

  return (
    <div
      className="ticket-container"
      onTouchStart={handleTouchStart}
      style={{ backgroundColor: bgColor }}
    >
      {renderPopup()}
      {finalImage ? (
        <div>
          <TicketDisplay finalImage={finalImage} />
          <button className="download-button" onClick={downloadTicket}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
          {(used || stampPosition) && (
            <div
              className="stamp-background animate-stamp"
              style={{
                top: stampPosition ? `${stampPosition.y - 50}px` : "50%",
                left: stampPosition ? `${stampPosition.x - 50}px` : "50%",
                transform: stampPosition ? "none" : "translate(-50%, -50%)",
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
