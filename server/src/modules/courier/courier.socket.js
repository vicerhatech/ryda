import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import CourierDelivery from './courier.model.js';

const ACTIVE_TRACKING_STATUSES = new Set(['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT']);
let courierIO;

export function courierRoom(courierId) {
  return `courier:${courierId}`;
}

function socketToken(socket) {
  const authorization = socket.handshake.headers.authorization || '';
  const [, bearerToken] = authorization.split(' ');
  return socket.handshake.auth?.token || bearerToken;
}

function socketUser(socket) {
  const token = socketToken(socket);
  if (!token) throw new Error('Authentication is required.');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const id = payload.id || payload._id || payload.userId;
  if (!id) throw new Error('Token does not contain a user identifier.');
  return { ...payload, id: String(id) };
}

function invalidLocation(latitude, longitude) {
  return typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180;
}

async function findCourier(courierId) {
  if (!mongoose.isValidObjectId(courierId)) return null;
  return CourierDelivery.findById(courierId);
}

function canAccessCourierRoom(courier, userId) {
  return String(courier.senderId) === String(userId) || String(courier.driverId) === String(userId);
}

export function registerCourierSocketHandlers(io) {
  courierIO = io;

  io.use((socket, next) => {
    try {
      socket.data.user = socketUser(socket);
      next();
    } catch (_error) {
      next(new Error('Socket authentication failed.'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('courier:join', async ({ courierId } = {}, acknowledge = () => {}) => {
      const courier = await findCourier(courierId);
      if (!courier || !canAccessCourierRoom(courier, socket.data.user.id)) {
        acknowledge({ ok: false, error: 'Courier room access denied.' });
        return;
      }
      socket.join(courierRoom(courier._id));
      acknowledge({ ok: true });
    });

    socket.on('courier:leave', ({ courierId } = {}) => {
      if (mongoose.isValidObjectId(courierId)) socket.leave(courierRoom(courierId));
    });

    socket.on('courier:location:update', async ({ courierId, latitude, longitude } = {}, acknowledge = () => {}) => {
      if (invalidLocation(latitude, longitude)) {
        acknowledge({ ok: false, error: 'Latitude and longitude are invalid.' });
        return;
      }

      const courier = await findCourier(courierId);
      if (!courier || socket.data.user.role !== 'DRIVER' || String(courier.driverId) !== socket.data.user.id) {
        acknowledge({ ok: false, error: 'Only the assigned driver may publish this location.' });
        return;
      }
      if (!ACTIVE_TRACKING_STATUSES.has(courier.status)) {
        acknowledge({ ok: false, error: 'Courier delivery is not in an active tracking state.' });
        return;
      }

      const update = {
        serviceId: String(courier._id),
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      };
      io.to(courierRoom(courier._id)).emit('courier:location:update', update);
      acknowledge({ ok: true });
    });
  });

  return io;
}

export function emitCourierAccepted(courier) {
  if (!courierIO) return;
  courierIO.to(courierRoom(courier._id)).emit('courier:accepted', {
    courierId: String(courier._id),
    driverId: String(courier.driverId),
    status: courier.status,
    acceptedAt: courier.acceptedAt
  });
}

export function emitCourierStatusUpdate(courier) {
  if (!courierIO) return;
  courierIO.to(courierRoom(courier._id)).emit('courier:status:update', {
    courierId: String(courier._id),
    status: courier.status,
    pickedUpAt: courier.pickedUpAt,
    deliveredAt: courier.deliveredAt
  });
}

export { ACTIVE_TRACKING_STATUSES };
