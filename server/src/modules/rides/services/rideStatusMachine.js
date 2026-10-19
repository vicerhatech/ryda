import AppError from '../../../shared/utils/AppError.js';

const transitions = Object.freeze({
  ACCEPTED: ['DRIVER_ARRIVING', 'CANCELLED', 'NO_SHOW'],
  DRIVER_ARRIVING: ['DRIVER_ARRIVED', 'CANCELLED', 'NO_SHOW'],
  DRIVER_ARRIVED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED']
});

export function assertValidRideTransition(currentStatus, nextStatus) {
  if (!transitions[currentStatus]?.includes(nextStatus)) {
    throw new AppError(`Ride cannot move from ${currentStatus} to ${nextStatus}.`, 409);
  }
}

export function operationalTimestamps(nextStatus, now) {
  if (nextStatus === 'IN_PROGRESS') {
    return { startedAt: now };
  }

  if (nextStatus === 'COMPLETED') {
    return { completedAt: now };
  }

  return {};
}
