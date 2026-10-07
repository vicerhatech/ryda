import mongoose from 'mongoose';
import AppError from '../../shared/utils/AppError.js';

// These models are owned by the identity, rides, courier, and payments modules.
// This adapter deliberately resolves them at runtime so driverOps does not recreate them.
export function getModel(name, { required = false } = {}) {
  const model = mongoose.models[name];

  if (!model && required) {
    throw new AppError(`${name} integration is not available yet.`, 503);
  }

  return model || null;
}

export function getDriverProfileModel() {
  return getModel('DriverProfile', { required: true });
}

export function getRideModel() {
  return getModel('Ride');
}

export function getCourierModel() {
  return getModel('CourierDelivery');
}

export function getWalletModel() {
  return getModel('DriverWallet');
}

export function getLiabilityModel() {
  return getModel('PlatformFeeLiability');
}
