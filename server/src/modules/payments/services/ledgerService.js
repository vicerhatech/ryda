import mongoose from 'mongoose';
import { RYDA_CONFIG } from '../../../shared/constants/rydaConfig.js';
import DriverWallet from '../models/DriverWallet.js';
import Payment from '../models/Payment.js';

function buildFinancials(grossAmount) {
  const platformFee = grossAmount * RYDA_CONFIG.PLATFORM_FEE_RATE;

  return {
    grossAmount,
    platformFee,
    driverNet: grossAmount - platformFee
  };
}

export function calculateRideFinancials(bookedSeats) {
  if (!Number.isInteger(bookedSeats) || bookedSeats < 1 || bookedSeats > RYDA_CONFIG.KEKE_SEAT_CAPACITY) {
    throw new Error(`bookedSeats must be an integer between 1 and ${RYDA_CONFIG.KEKE_SEAT_CAPACITY}.`);
  }

  return buildFinancials(bookedSeats * RYDA_CONFIG.RIDE_FARE_PER_SEAT_NGN);
}

export function calculateCourierFinancials() {
  return buildFinancials(RYDA_CONFIG.COURIER_FARE_NGN);
}

export async function creditDriverEarningOnce(paymentId) {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId, status: 'PAID', walletCreditedAt: null },
        { $set: { walletCreditedAt: new Date() } },
        { new: true, session }
      );

      if (!payment) {
        result = { credited: false };
        return;
      }

      await DriverWallet.findOneAndUpdate(
        { driverId: payment.driverId },
        {
          $setOnInsert: { driverId: payment.driverId },
          $inc: {
            availableBalance: payment.driverNet,
            totalEarned: payment.driverNet
          }
        },
        { upsert: true, new: true, session, setDefaultsOnInsert: true }
      );

      result = { credited: true, payment };
    });

    return result;
  } finally {
    await session.endSession();
  }
}
