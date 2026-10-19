import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

export const ACTIVE_RIDE_STATUSES = Object.freeze(['ACCEPTED', 'DRIVER_ARRIVING', 'DRIVER_ARRIVED', 'IN_PROGRESS']);
export const ACTIVE_COURIER_STATUSES = Object.freeze(['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT']);

function model(name) {
  return mongoose.models[name] || null;
}

export async function findActiveAssignments(driverId) {
  const Ride = model('Ride');
  const CourierDelivery = model('CourierDelivery');
  const [ride, courier] = await Promise.all([
    Ride?.find({ driverId, status: { $in: ACTIVE_RIDE_STATUSES } }).sort({ acceptedAt: 1 }).lean() || [],
    CourierDelivery?.find({ driverId, status: { $in: ACTIVE_COURIER_STATUSES } }).sort({ acceptedAt: 1 }).lean() || []
  ]);

  return { rides: ride, couriers: courier };
}

export async function assertNoActiveAssignment(driverId, serviceType) {
  const assignments = await findActiveAssignments(driverId);
  const conflicts = [...assignments.rides, ...assignments.couriers];
  if (conflicts.length) {
    throw new AppError('Driver already has an active ride or courier assignment.', 409);
  }
  return assignments;
}
