import React from 'react';
import TicketDisplay from './TicketDisplay';

const SampleTicket = () => {
  const owner = { firstName: "Emre", lastName: "Uslu" };
  const color = "Red";
  const character = "RICK";

  return (
    <div className="sample-ticket">
      <TicketDisplay owner={owner} color={color} character={character} />
    </div>
  );
};

export default SampleTicket;
