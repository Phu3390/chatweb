import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { cookieStorage } from "../utils/cookie";
const BASE_URL = import.meta.env.VITE_API_URL;

export const stompClient = new Client({
  webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
  reconnectDelay: 5000,
  connectHeaders: {
    Authorization: `Bearer ${cookieStorage.getToken()}`,
  },
});
