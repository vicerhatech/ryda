import { io } from 'socket.io-client';

let socket;

function authToken() {
  return localStorage.getItem('ryda.auth.token') || undefined;
}

export function getCourierSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });
  }
  socket.auth = { token: authToken() };
  if (!socket.connected) socket.connect();
  return socket;
}

export function leaveCourierRoom(courierId) {
  if (socket?.connected) socket.emit('courier:leave', { courierId });
}
