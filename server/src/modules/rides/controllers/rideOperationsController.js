import mongoose from 'mongoose';

import { RYDA_CONFIG } from '../../../shared/constants/rydaConfig.js';
import AppError from '../../../shared/utils/AppError.js';
import { Ride } from '../models/Ride.js';
import { assertDriverEligible } from '../services/driverEligibility.js';
import { assertValidRideTransition, operationalTimestamps } from '../services/rideStatusMachine.js';
import { emitRideAccepted, emitRideStatusUpdate } from '../sockets/rideTrackingSocket.js';

const PAYMENT_GRACE_PERIOD_MS = RYDA_CONFIG.PAYMENT_GRACE_PERIOD_MINUTES * 60 * 1000;

export async function acceptRide(request, response, next) {
  try {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('Ride not found.', 404);
    }

    await assertDriverEligible(request.user.id);

    const acceptedAt = new Date();
    const ride = await Ride.findOneAndUpdate(
      { _id: id, status: 'REQUESTED', driverId: null },
      {
        $set: {
          driverId: request.user.id,
          status: 'ACCEPTED',
          acceptedAt,
          paymentDeadlineAt: new Date(acceptedAt.getTime() + PAYMENT_GRACE_PERIOD_MS)
        }
      },
      { new: true, runValidators: true }
    );

    if (!ride) {
      throw new AppError('This ride is no longer available to accept.', 409);
    }

    emitRideAccepted(ride);
    return response.status(200).json({ ride });
  } catch (error) {
    return next(error);
  }
}

export async function updateRideStatus(request, response, next) {
  try {
    const { id } = request.params;
    const { status } = request.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('Ride not found.', 404);
    }

    if (typeof status !== 'string') {
      throw new AppError('A target ride status is required.', 400);
    }

    const ride = await Ride.findById(id).select('driverId status');
    if (!ride) {
      throw new AppError('Ride not found.', 404);
    }

    if (!ride.driverId || ride.driverId.toString() !== request.user.id) {
      throw new AppError('Only the assigned driver can update this ride.', 403);
    }

    assertValidRideTransition(ride.status, status);

    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, driverId: request.user.id, status: ride.status },
      { $set: { status, ...operationalTimestamps(status, new Date()) } },
      { new: true, runValidators: true }
    );

    if (!updatedRide) {
      throw new AppError('Ride status changed before your update could be applied. Please refresh and try again.', 409);
    }

    emitRideStatusUpdate(updatedRide);
    return response.status(200).json({ ride: updatedRide });
  } catch (error) {
    return next(error);
  }
}
