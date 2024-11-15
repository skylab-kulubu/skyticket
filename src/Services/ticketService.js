export const fetchTicketById = async (ticketId) => {
  return {
    id: ticketId,
    owner: { firstName: "Emre", lastName: "Uslu" },
    options: ["Blue", "YODA"],
  };
};

export const submitTicket = async (ticketId) => {
  return {
    id: ticketId,
    stamped: false,
  };
};
