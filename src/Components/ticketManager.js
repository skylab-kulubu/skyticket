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
  "DEADPOOL", "YODA", "FINN", "JAKE", "SPIDERMAN", "RICK",
  "HARLEY_QUINN", "SUNGER_BOB", "RIGBY_VE_MORDECAI", "WONDER_WOMAN",
  "SCOOBY_DOO", "HARRY_POTTER", "BATMAN", "IRON_MAN", "JOKER",
  "PRENSES_CIKLET", "WOODY", "THANOS", "GWEN_STACY", "SUPERMAN",
  "WOLVERINE", "HULK"
]);

const COLOR_ENUMS = new Set(["YESIL", "MAVI", "KIRMIZI", "MOR"]);

const TicketManager = () => {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f4f8");
  const [stampPosition, setStampPosition] = useState(null);
  const [popupMessage, setPopupMessage] = useState(""); // Popup mesajı
  const [showPopup, setShowPopup] = useState(false); // Popup görünürlüğü
  const ticketImageRef = useRef(null);

  // Bileti API'den yükle
  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetchTicketById(ticketId);
        if (response.success) {
          setTicketData(response.data);
          if (response.data.used) {
            setPopupMessage(
              `Sayın ${response.data.owner.firstName} ${response.data.owner.lastName}, zaten ${response.data.event.name} etkinliğindesiniz!`
            );
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
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

  // Ticket görseline göre arkaplan rengini ayarla
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

  // İndirilebilir bilet oluşturma
  const downloadTicket = () => {
    if (!finalImage) return;
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "ticket.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Damga ekleme işlemi
  const handleStamp = async () => {
    try {
      const response = await submitTicket(ticketId);
      if (response.success) {
        if (ticketData?.used) {
          setPopupMessage(
            `Sayın ${ticketData.owner.firstName} ${ticketData.owner.lastName}, zaten ${ticketData.event.name} etkinliğindesiniz!`
          );
        } else {
          setPopupMessage(
            `${response.data.event.name} etkinliğine hoş geldiniz, ${response.data.owner.firstName} ${response.data.owner.lastName}!`
          );
        }
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setTicketData(response.data);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  const handleTouchStart = (event) => {
    if (!ticketData || ticketData.used) return;

    if (event.touches.length >= 1) {
      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      setStampPosition({ x, y });

      const audio = new Audio(stampSoundPath);
      audio.play();

      handleStamp();
    }
  };

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

  if (!ticketData) return <p>BİLET YÜKLENİYOR...</p>;

  const { owner, options, event } = ticketData;
  const { character, color } = getCharacterAndColor(options);

  return (
    <div
      className="ticket-container"
      onTouchStart={handleTouchStart}
      style={{ backgroundColor: bgColor }}
    >
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
      {finalImage && (
        <button
          onClick={downloadTicket}
          className="download-button"
          title="Bileti indir"
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
      )}
      {finalImage ? (
        <div>
          <TicketDisplay finalImage={finalImage} />
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
