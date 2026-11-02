import multer from 'multer';
import AppError from '../../../shared/utils/AppError.js';

export const MAX_VERIFICATION_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const VEHICLE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IDENTITY_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

function allowedMimeTypesFor(fieldName) {
  if (fieldName === 'vehicleImage') {
    return VEHICLE_IMAGE_MIME_TYPES;
  }

  if (fieldName === 'identityDocument') {
    return IDENTITY_DOCUMENT_MIME_TYPES;
  }

  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VERIFICATION_FILE_SIZE_BYTES },
  fileFilter: (_request, file, callback) => {
    const allowedMimeTypes = allowedMimeTypesFor(file.fieldname);

    if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError(`Unsupported file type for ${file.fieldname}.`, 400));
      return;
    }

    callback(null, true);
  }
}).fields([
  { name: 'vehicleImage', maxCount: 1 },
  { name: 'identityDocument', maxCount: 1 }
]);

export function uploadDriverVerificationFiles(request, response, next) {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Each verification file must be 5 MB or smaller.', 400));
      }

      return next(new AppError('Submit one vehicle image and one identity document.', 400));
    }

    if (error) {
      return next(error);
    }

    return next();
  });
}
