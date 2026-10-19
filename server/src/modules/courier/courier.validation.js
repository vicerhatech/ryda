import AppError from '../../shared/utils/AppError.js';

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${label} is required.`, 400);
  }

  return value.trim();
}

function coordinate(value, label, minimum, maximum) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) {
    throw new AppError(`${label} must be a number between ${minimum} and ${maximum}.`, 400);
  }

  return value;
}

function location(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(`${label} is required.`, 400);
  }

  return {
    address: requiredText(value.address, `${label} address`),
    latitude: coordinate(value.latitude, `${label} latitude`, -90, 90),
    longitude: coordinate(value.longitude, `${label} longitude`, -180, 180)
  };
}

export function validateCourierInput(input = {}) {
  return {
    recipientName: requiredText(input.recipientName, 'Recipient name'),
    recipientPhone: requiredText(input.recipientPhone, 'Recipient phone'),
    packageDescription: requiredText(input.packageDescription, 'Package description'),
    pickup: location(input.pickup, 'Pickup'),
    dropoff: location(input.dropoff, 'Drop-off')
  };
}
