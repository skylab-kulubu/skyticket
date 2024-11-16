import axios from "axios";

const API_BASE_URL = "https://backend.skyticket.yildizskylab.com/api/tickets";

export const fetchTicketById = async (ticketId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getTicketById/${ticketId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

export const submitTicket = async (ticketId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/submitTicket/${ticketId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting ticket:", error);
    throw error;
  }
};
