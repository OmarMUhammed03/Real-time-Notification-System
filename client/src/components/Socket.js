import { io } from "socket.io-client";
import { NOTIFICATION_SERVICE_URL } from "../utils/constants";

let socketInstance = null;

export default function getSocket() {
  if (!socketInstance) {
    socketInstance = io(NOTIFICATION_SERVICE_URL, { withCredentials: true });
  }
  return socketInstance;
}