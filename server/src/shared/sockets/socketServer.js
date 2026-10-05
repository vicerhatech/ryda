import { Server } from 'socket.io';

let io;

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('service:join', ({ serviceType, serviceId }) => {
      if (!['ride', 'courier'].includes(serviceType) || !serviceId) return;
      socket.join(`${serviceType}:${serviceId}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.IO has not been initialized.');
  return io;
}
