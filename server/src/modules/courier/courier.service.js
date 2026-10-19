import mongoose from 'mongoose';
import { RYDA_CONFIG } from '../../shared/constants/rydaConfig.js';
import AppError from '../../shared/utils/AppError.js';
import CourierDelivery from './courier.model.js';
import { assertEligibleCourierDriver } from './courier.driverEligibility.js';
import { validateCourierInput } from './courier.validation.js';

const COURIER_TRANSITIONS = Object.freeze({
  ACCEPTED: 'PICKED_UP',
  PICKED_UP: 'IN_TRANSIT',
  IN_TRANSIT: 'DELIVERED'
});

function calculateCourierPricing() {
  const grossFare = RYDA_CONFIG.COURIER_FARE_NGN;
  const platformFee = grossFare * RYDA_CONFIG.PLATFORM_FEE_RATE;

  return { grossFare, platformFee, driverNet: grossFare - platformFee };
}

function validCourierId(courierId) {
  if (!mongoose.isValidObjectId(courierId)) {
    throw new AppError('Invalid courier delivery id.', 400);
  }
}

export async function createCourierDelivery(senderId, input) {
  const details = validateCourierInput(input);
  const pricing = calculateCourierPricing();

  return CourierDelivery.create({
    senderId,
    ...details,
    ...pricing,
    status: 'REQUESTED',
    paymentStatus: 'PENDING'
  });
}

export async function getSenderCourierDeliveries(senderId) {
  return CourierDelivery.find({ senderId }).sort({ createdAt: -1 });
}

export async function getSenderCourierDelivery(senderId, courierId) {
  validCourierId(courierId);
  const courier = await CourierDelivery.findOne({ _id: courierId, senderId });

  if (!courier) {
    throw new AppError('Courier delivery was not found.', 404);
  }

  return courier;
}

export async function cancelSenderCourierDelivery(senderId, courierId) {
  const courier = await getSenderCourierDelivery(senderId, courierId);

  if (courier.status !== 'REQUESTED' && courier.status !== 'ACCEPTED') {
    throw new AppError('This courier delivery can no longer be cancelled.', 409);
  }
  if (courier.status === 'ACCEPTED' && courier.paymentStatus !== 'PENDING') {
    throw new AppError('An accepted courier delivery can only be cancelled here before payment.', 409);
  }

  const needsLiabilityWaiver = courier.status === 'ACCEPTED' && courier.paymentStatus === 'PENDING';
  courier.status = 'CANCELLED';
  await courier.save();

  return {
    courier,
    paymentIntegration: needsLiabilityWaiver
      ? { liabilityWaiverRequired: true, reason: 'Accepted unpaid courier delivery was cancelled.' }
      : null
  };
}

export async function acceptCourierDelivery(driverId, courierId) {
  validCourierId(courierId);
  await assertEligibleCourierDriver(driverId);

  const acceptedAt = new Date();
  const paymentDeadlineAt = new Date(
    acceptedAt.getTime() + RYDA_CONFIG.PAYMENT_GRACE_PERIOD_MINUTES * 60 * 1000
  );
  const courier = await CourierDelivery.findOneAndUpdate(
    { _id: courierId, status: 'REQUESTED', driverId: null },
    { $set: { driverId, status: 'ACCEPTED', acceptedAt, paymentDeadlineAt } },
    { new: true }
  );

  if (!courier) {
    throw new AppError('Courier delivery is no longer available for acceptance.', 409);
  }

  return courier;
}

export async function updateCourierDeliveryStatus(driverId, courierId, status) {
  validCourierId(courierId);
  if (typeof status !== 'string' || !Object.values(COURIER_TRANSITIONS).includes(status)) {
    throw new AppError('Invalid courier status transition.', 400);
  }

  const courier = await CourierDelivery.findOne({ _id: courierId, driverId });
  if (!courier) throw new AppError('Courier delivery was not found.', 404);
  if (COURIER_TRANSITIONS[courier.status] !== status) {
    throw new AppError(`Courier delivery cannot transition from ${courier.status} to ${status}.`, 409);
  }

  const now = new Date();
  const timestamps = status === 'PICKED_UP'
    ? { pickedUpAt: now }
    : status === 'DELIVERED'
      ? { deliveredAt: now }
      : {};
  const updated = await CourierDelivery.findOneAndUpdate(
    { _id: courierId, driverId, status: courier.status },
    { $set: { status, ...timestamps } },
    { new: true }
  );

  if (!updated) throw new AppError('Courier delivery status changed. Refresh and try again.', 409);
  return updated;
}

export { calculateCourierPricing, COURIER_TRANSITIONS };
