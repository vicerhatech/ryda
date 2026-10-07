import mongoose from 'mongoose';
import { RYDA_CONFIG } from '../../shared/constants/rydaConfig.js';
import AppError from '../../shared/utils/AppError.js';
import CourierDelivery from './courier.model.js';
import { validateCourierInput } from './courier.validation.js';

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

export { calculateCourierPricing };
