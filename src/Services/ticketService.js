export const fetchTicketById = async (ticketId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/tickets/getTicketById/${ticketId}`
    );
    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch ticket");
    }
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    throw error;
  }
};

export const submitTicket = async (ticketId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/tickets/submitTicket/${ticketId}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to submit ticket");
    }
  } catch (error) {
    console.error("Error in submitTicket:", error);
    throw error;
  }
};
