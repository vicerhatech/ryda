import { io } from 'socket.io-client';

let rideSocket;

export function getRideSocket(accessToken) {
  if (!rideSocket) {
    rideSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: false,
      auth: { token: accessToken }
    });
  } else {
    rideSocket.auth = { token: accessToken };
  }

  return rideSocket;
}
