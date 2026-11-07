import AppError from '../../shared/utils/AppError.js';
import DriverProfile from '../identity/models/DriverProfile.js';
import { getDriverFinancialEligibility } from '../payments/services/liabilityService.js';

export async function assertEligibleCourierDriver(driverId) {
  const profile = await DriverProfile.findOne({ userId: driverId }).lean();

  if (!profile) throw new AppError('Driver profile was not found.', 404);
  if (profile.verificationStatus !== 'APPROVED') throw new AppError('Driver verification must be approved.', 403);
  if (!profile.isOnline) throw new AppError('Driver must be online to accept courier requests.', 403);
  if (profile.isSuspended) throw new AppError('Suspended drivers cannot accept courier requests.', 403);

  const eligibility = await getDriverFinancialEligibility(driverId);
  if (eligibility.isBlocked) throw new AppError('Outstanding overdue platform fees must be settled.', 403);

  return profile;
}
