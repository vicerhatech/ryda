import mongoose from 'mongoose';
import AppError from '../../shared/utils/AppError.js';

function requiredExternalModel(name) {
  const model = mongoose.models[name];
  if (!model) {
    throw new AppError(`${name} integration is not available yet.`, 503);
  }
  return model;
}

export async function assertEligibleCourierDriver(driverId) {
  const DriverProfile = requiredExternalModel('DriverProfile');
  const PlatformFeeLiability = requiredExternalModel('PlatformFeeLiability');
  const profile = await DriverProfile.findOne({ userId: driverId }).lean();

  if (!profile) throw new AppError('Driver profile was not found.', 404);
  if (profile.verificationStatus !== 'APPROVED') throw new AppError('Driver verification must be approved.', 403);
  if (!profile.isOnline) throw new AppError('Driver must be online to accept courier requests.', 403);
  if (profile.isSuspended) throw new AppError('Suspended drivers cannot accept courier requests.', 403);

  const overdueLiability = await PlatformFeeLiability.exists({ driverId, status: 'OVERDUE' });
  if (overdueLiability) throw new AppError('Outstanding overdue platform fees must be settled.', 403);

  return profile;
}
