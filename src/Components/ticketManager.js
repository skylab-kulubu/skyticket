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
  "DEADPOOL", "YODA", "ADVENTURE_TIME", "SPIDERMAN", "RICK",
  "HARLEY_QUINN", "GROOT", "KIM_POSSIBLE", "SUNGER_BOB",
  "RIGBY_VE_MORDECAI", "WONDER_WOMAN", "SCOOBY_DOO",
  "HARRY_POTTER", "BATMAN", "IRON_MAN", "JOKER",
  "PRENSES_CIKLET", "WOODY", "THANOS", "GWEN_STACY",
  "SUPERMAN", "WOLVERINE"
]);

const COLOR_ENUMS = new Set(["YESIL", "MAVI", "KIRMIZI", "MOR"]);

const TicketManager = () => {
  const { ticketId } = useParams(); // URL'den ID'yi al
  const [ticketData, setTicketData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f4f8");
  const [stampPosition, setStampPosition] = useState(null);
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

  // Damga ekleme işlemi
  const handleTouchStart = (event) => {
    if (!ticketData || ticketData.used) return; // Eğer bilet used ise işlem yapma

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
    try {
      const updatedData = await submitTicket(ticketId);
      setTicketData(updatedData); // API'den dönen güncellenmiş veriyi state'e aktar
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
      onTouchStart={handleTouchStart}
      style={{ backgroundColor: bgColor }}
    >
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
