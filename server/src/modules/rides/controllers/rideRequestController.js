import mongoose from 'mongoose';

import AppError from '../../../shared/utils/AppError.js';
import { Ride } from '../models/Ride.js';
import { emitRideStatusUpdate } from '../sockets/rideTrackingSocket.js';

const CANCELLABLE_STATUSES = ['REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVING', 'DRIVER_ARRIVED'];

function isValidRideId(id) {
  return mongoose.isValidObjectId(id);
}

export async function createRide(request, response, next) {
  try {
    const { pickup, destination, bookedSeats } = request.body;
    const ride = await Ride.create({
      riderId: request.user.id,
      pickup,
      destination,
      bookedSeats
    });

    return response.status(201).json({ ride });
  } catch (error) {
    return next(error);
  }
}

export async function getMyRides(request, response, next) {
  try {
    const rides = await Ride.find({ riderId: request.user.id }).sort({ createdAt: -1 });

    return response.status(200).json({ rides });
  } catch (error) {
    return next(error);
  }
}

export async function getRide(request, response, next) {
  try {
    const { id } = request.params;

    if (!isValidRideId(id)) {
      throw new AppError('Ride not found.', 404);
    }

    const ride = await Ride.findOne({ _id: id, riderId: request.user.id });
    if (!ride) {
      throw new AppError('Ride not found.', 404);
    }

    return response.status(200).json({ ride });
  } catch (error) {
    return next(error);
  }
}

export async function cancelRide(request, response, next) {
  try {
    const { id } = request.params;

    if (!isValidRideId(id)) {
      throw new AppError('Ride not found.', 404);
    }

    const ride = await Ride.findOne({ _id: id, riderId: request.user.id }).select('status');
    if (!ride) {
      throw new AppError('Ride not found.', 404);
    }

    if (!CANCELLABLE_STATUSES.includes(ride.status)) {
      throw new AppError('This ride can no longer be cancelled because the trip has begun or ended.', 409);
    }

    const cancelledRide = await Ride.findOneAndUpdate(
      { _id: id, riderId: request.user.id, status: ride.status },
      { $set: { status: 'CANCELLED' } },
      { new: true, runValidators: true }
    );

    if (!cancelledRide) {
      throw new AppError('Ride status changed before cancellation. Please refresh and try again.', 409);
    }

    emitRideStatusUpdate(cancelledRide);
    return response.status(200).json({ ride: cancelledRide });
  } catch (error) {
    return next(error);
  }
}
