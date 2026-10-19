import mongoose from 'mongoose';
import AppError from '../../../shared/utils/AppError.js';
import DriverWallet from '../models/DriverWallet.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import { getDriverFinancialEligibility } from '../services/liabilityService.js';

async function getOrCreateWallet(driverId, session) {
  return DriverWallet.findOneAndUpdate(
    { driverId },
    { $setOnInsert: { driverId } },
    { new: true, upsert: true, setDefaultsOnInsert: true, session }
  );
}

export async function getDriverWallet(request, response, next) {
  try {
    const eligibility = await getDriverFinancialEligibility(request.user.id);
    const wallet = await getOrCreateWallet(request.user.id);
    const withdrawals = await WithdrawalRequest.find({ driverId: request.user.id }).sort({ requestedAt: -1 });

    return response.status(200).json({ wallet, eligibility, withdrawals });
  } catch (error) {
    return next(error);
  }
}

export async function createWithdrawal(request, response, next) {
  const session = await mongoose.startSession();

  try {
    const { amount } = request.body;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      throw new AppError('Withdrawal amount must be greater than zero.', 400);
    }

    let withdrawal;
    let wallet;
    await session.withTransaction(async () => {
      await getOrCreateWallet(request.user.id, session);
      wallet = await DriverWallet.findOneAndUpdate(
        { driverId: request.user.id, availableBalance: { $gte: amount } },
        { $inc: { availableBalance: -amount, pendingBalance: amount } },
        { new: true, session }
      );

      if (!wallet) throw new AppError('Withdrawal amount exceeds available balance.', 400);

      [withdrawal] = await WithdrawalRequest.create(
        [{ driverId: request.user.id, amount, status: 'PENDING' }],
        { session }
      );
    });

    return response.status(201).json({ withdrawal, wallet });
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
}

export async function listWithdrawals(request, response, next) {
  try {
    const withdrawals = await WithdrawalRequest.find({ driverId: request.user.id }).sort({ requestedAt: -1 });
    return response.status(200).json({ withdrawals });
  } catch (error) {
    return next(error);
  }
}
