import React from 'react';
import TicketDisplay from './ticketDisplay';

const SampleTicket = () => {
  const owner = { firstName: "Emre", lastName: "Uslu" };
  const color = "Blue";
  const character = "YODA";

  return (
    <div>
      <TicketDisplay owner={owner} color={color} character={character} />
    </div>
  );
};

export default SampleTicket;
