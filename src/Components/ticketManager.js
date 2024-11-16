import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TicketEditor from "./ticketEditor";
import TicketDisplay from "./ticketDisplay";
import { fetchTicketById, submitTicket } from "../Services/ticketService";
import ColorThief from "colorthief";
import stampSoundPath from "../Tickets/stamp-sound.mp3";
const stampPath = require(`../Tickets/ticket-stamp2.png`); // Damga görseli

// Enum değerlerini tanımlıyoruz
const CHARACTER_ENUMS = new Set([
  "DEADPOOL", "YODA", "FINN", "JAKE", "SPIDERMAN", "RICK",
  "HARLEY_QUINN", "SUNGER_BOB", "RIGBY_VE_MORDECAI", "WONDER_WOMAN",
  "SCOOBY_DOO", "HARRY_POTTER", "BATMAN", "IRON_MAN", "JOKER",
  "PRENSES_CIKLET", "WOODY", "THANOS", "GWEN_STACY", "SUPERMAN",
  "WOLVERINE", "HULK"
]);

const COLOR_ENUMS = new Set(["YESIL", "MAVI", "KIRMIZI", "MOR"]);

const TicketManager = () => {
  const { ticketId } = useParams(); // URL'den ID'yi al
  const [ticketData, setTicketData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f4f8");
  const [stampPosition, setStampPosition] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false); // Popup gösterim durumu
  const ticketImageRef = useRef(null);

  // Bileti API'den yükle
  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetchTicketById(ticketId);
        if (response.success) {
          setTicketData(response.data); // API'den gelen 'data' nesnesini kullan
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
        document.body.style.backgroundColor = bg; // Body'nin arkaplan rengini değiştir
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

  // Damga ekleme işlemi için klavye dinleyicisi
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && ticketData && !ticketData.used) {
        // Boşluk tuşu damga eklemek için kullanılır
        setStampPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const audio = new Audio(stampSoundPath);
        audio.play();
        handleStamp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ticketData]);

  // Damga ekleme işlemi
  const handleStamp = async () => {
    try {
      const response = await submitTicket(ticketId);
      if (response.success) {
        setTicketData(response.data); // API'den dönen güncellenmiş veriyi state'e aktar
        setPopupVisible(true); // Popup göster
        setTimeout(() => setPopupVisible(false), 3000); // 3 saniye sonra popup kaybolur
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  // Options'dan karakter ve renkleri enumlara göre ayır
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

  if (!ticketData) return <p>Loading ticket...</p>;

  const { owner, options, used } = ticketData;
  const { character, color } = getCharacterAndColor(options);

  return (
    <div
      className="ticket-container"
      style={{ backgroundColor: bgColor }}
    >
      {popupVisible && (
        <div className="popup">
          <p>Yeşil bir etkinliğe hoş geldiniz!</p>
        </div>
      )}
      {finalImage ? (
        <div>
          <TicketDisplay finalImage={finalImage} />
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
