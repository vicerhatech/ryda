import mongoose from 'mongoose';

import AppError from '../../../shared/utils/AppError.js';

function getRegisteredModel(modelName) {
  const model = mongoose.models[modelName];

  if (!model) {
    throw new AppError(
      `Driver eligibility cannot be checked because the ${modelName} module is not registered.`,
      503
    );
  }

  return model;
}

/**
 * Verifies the cross-module driver eligibility contract without owning either
 * the driver-profile or payment-liability implementations.
 */
export async function assertDriverEligible(driverId) {
  const DriverProfile = getRegisteredModel('DriverProfile');
  const PlatformFeeLiability = getRegisteredModel('PlatformFeeLiability');

  const [profile, hasOverdueLiability] = await Promise.all([
    DriverProfile.findOne({ userId: driverId })
      .select('verificationStatus isOnline isSuspended')
      .lean(),
    PlatformFeeLiability.exists({ driverId, status: 'OVERDUE' })
  ]);

  if (
    !profile ||
    profile.verificationStatus !== 'APPROVED' ||
    profile.isOnline !== true ||
    profile.isSuspended === true ||
    hasOverdueLiability
  ) {
    throw new AppError('You are not currently eligible to accept ride requests.', 403);
  }
}
