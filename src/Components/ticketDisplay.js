import React from "react";
import { getImagePath } from "../utils/constants";

const TicketDisplay = ({ owner, color, character }) => {
  const imagePath = getImagePath(color, character);

  return (
    <div className={`ticket ${color.toLowerCase()}-ticket`}>
      <img src={imagePath} alt={`${character} Ticket`} />
      <h2>
        {owner.firstName} {owner.lastName}
      </h2>
      <p>
        {color} Ticket - {character}
      </p>
    </div>
  );
};

export default TicketDisplay;
