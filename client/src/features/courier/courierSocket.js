import { io } from 'socket.io-client';
import { api } from '../../shared/lib/api.js';

let socket;

function authToken() {
  const authorization = api.defaults.headers.common.Authorization;
  return typeof authorization === 'string' ? authorization.replace(/^Bearer\s+/i, '') : undefined;
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
