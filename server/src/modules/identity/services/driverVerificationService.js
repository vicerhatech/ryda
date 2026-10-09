import AppError from '../../../shared/utils/AppError.js';
import DriverProfile from '../models/DriverProfile.js';

export async function submitDriverVerification(userId, submission) {
  const existingProfile = await DriverProfile.findOne({ userId });

  if (existingProfile) {
    throw new AppError('Driver verification has already been submitted.', 409);
  }

  try {
    return await DriverProfile.create({
      userId,
      vehicleType: 'KEKE',
      verificationStatus: 'PENDING',
      ...submission
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError('Driver verification has already been submitted.', 409);
    }

    throw error;
  }
}

export async function getDriverVerification(userId) {
  const profile = await DriverProfile.findOne({ userId });

  if (!profile) {
    throw new AppError('Driver verification has not been submitted.', 404);
  }

  return profile;
}
