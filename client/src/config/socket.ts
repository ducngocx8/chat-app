import { io, Socket } from "socket.io-client";
export const BACKEND_BASE = "http://localhost:7000";
// export const BACKEND_BASE = "https://chat-api.kiemthecaofree.com";
let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_BASE, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
