import axios from "axios";

// Set the base URL for the API
const baseURL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = baseURL;

export const createGame = async () => {
  try {
    const response = await axios.get(`/games/create`);
    const roomId = response.data.roomId;

    return roomId;
  } catch (error) {
    console.error(error);
  }
};
