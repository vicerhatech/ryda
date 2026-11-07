import { v2 as cloudinary } from 'cloudinary';
import AppError from '../../../shared/utils/AppError.js';

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new AppError('Driver verification uploads are not configured. Contact support.', 503);
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });
}

function isSecureCloudinaryUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com';
  } catch (_error) {
    return false;
  }
}

export async function uploadDriverVerificationFile({ userId, fieldName, file }) {
  configureCloudinary();

  const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ryda/driver-verification/${userId}`,
        resource_type: resourceType,
        public_id: `${fieldName}-${Date.now()}`,
        overwrite: false
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(uploadResult);
      }
    );

    uploadStream.end(file.buffer);
  });

  if (!isSecureCloudinaryUrl(result?.secure_url)) {
    throw new AppError('The upload provider did not return a secure file URL.', 502);
  }

  return result.secure_url;
}
