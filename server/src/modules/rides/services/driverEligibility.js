import AppError from '../../../shared/utils/AppError.js';
import DriverProfile from '../../identity/models/DriverProfile.js';
import { getDriverFinancialEligibility } from '../../payments/services/liabilityService.js';

/**
 * Combines the authoritative driver profile and payment liability checks.
 */
export async function assertDriverEligible(driverId) {
  const [profile, financialEligibility] = await Promise.all([
    DriverProfile.findOne({ userId: driverId })
      .select('verificationStatus isOnline isSuspended')
      .lean(),
    getDriverFinancialEligibility(driverId)
  ]);

  if (
    !profile ||
    profile.verificationStatus !== 'APPROVED' ||
    profile.isOnline !== true ||
    profile.isSuspended !== false ||
    financialEligibility.isBlocked
  ) {
    throw new AppError('You are not currently eligible to accept ride requests.', 403);
  }
}
