import mongoose from 'mongoose';

export const DRIVER_VERIFICATION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

const driverProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      immutable: true
    },
    vehicleType: {
      type: String,
      enum: ['KEKE'],
      default: 'KEKE',
      required: true,
      immutable: true
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    vehicleImage: {
      type: String,
      required: true,
      trim: true
    },
    identityDocument: {
      type: String,
      required: true,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: DRIVER_VERIFICATION_STATUSES,
      default: 'PENDING',
      required: true
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    currentLatitude: {
      type: Number,
      default: null,
      min: -90,
      max: 90
    },
    currentLongitude: {
      type: Number,
      default: null,
      min: -180,
      max: 180
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    completedRides: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

const DriverProfile = mongoose.models.DriverProfile || mongoose.model('DriverProfile', driverProfileSchema);

export default DriverProfile;
