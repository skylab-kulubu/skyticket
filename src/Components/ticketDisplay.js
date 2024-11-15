import React from "react";

const TicketDisplay = ({ finalImage }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "ticket.png";
    link.click();
  };

  return (
    <div className="ticket-container">
      <img src={finalImage} alt="Final Ticket" className="ticket-image" />
    </div>
  );
};

export default TicketDisplay;
