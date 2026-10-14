import AppError from '../../../shared/utils/AppError.js';

function requireText(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${fieldName} is required.`, 400);
  }
}

function validateCloudinaryUrl(value, fieldName) {
  requireText(value, fieldName);

  let url;
  try {
    url = new URL(value.trim());
  } catch (_error) {
    throw new AppError(`${fieldName} must be a valid URL.`, 400);
  }

  if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com') {
    throw new AppError(`${fieldName} must be an HTTPS Cloudinary delivery URL.`, 400);
  }

  return url.toString();
}

export function validateDriverVerificationInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AppError('Verification submission data is required.', 400);
  }

  const allowedFields = ['vehicleNumber', 'vehicleImage', 'identityDocument'];
  const fields = Object.keys(input);

  if (fields.some((field) => !allowedFields.includes(field))) {
    throw new AppError('Only vehicleNumber, vehicleImage and identityDocument can be submitted.', 400);
  }

  requireText(input.vehicleNumber, 'Vehicle number');
  const vehicleNumber = input.vehicleNumber.trim().toUpperCase();

  if (vehicleNumber.length > 50) {
    throw new AppError('Vehicle number must not exceed 50 characters.', 400);
  }

  return {
    vehicleNumber,
    vehicleImage: validateCloudinaryUrl(input.vehicleImage, 'Vehicle image'),
    identityDocument: validateCloudinaryUrl(input.identityDocument, 'Identity document')
  };
}
