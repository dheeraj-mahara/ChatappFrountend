import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false, // 🔥 important
  withCredentials: true,
  transports: ["websocket"],
});
export default socket;