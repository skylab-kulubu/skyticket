import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketDisplay from "./ticketDisplay";
import { fetchTicketById, submitTicket } from "../Services/ticketService";

const TicketManager = () => {
  const { ticketId } = useParams(); // URL'den ticketId'yi alır
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await fetchTicketById(ticketId);
        setTicketData(data);
      } catch (error) {
        console.error("Error fetching ticket:", error.message);
      }
    };

    loadTicket();
  }, [ticketId]);

  const handleStamp = async () => {
    try {
      const updatedData = await submitTicket(ticketId);
      alert("Ticket stamped successfully!");
      setTicketData(updatedData);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!ticketData) return <p>Loading ticket...</p>;

  const { owner, options } = ticketData;
  const color = options[0];
  const character = options[1];

  return (
    <div className="ticket-manager">
      {character ? (
        <TicketDisplay owner={owner} color={color} character={character} />
      ) : (
        <p>Character not found in options</p>
      )}
      <button onClick={handleStamp}>Stamp Ticket</button>
    </div>
  );
};

export default TicketManager;
