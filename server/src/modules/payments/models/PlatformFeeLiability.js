import mongoose from 'mongoose';
import { SERVICE_STATUSES } from '../../../shared/constants/rydaConfig.js';

const { Schema } = mongoose;

const platformFeeLiabilitySchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceType: { type: String, enum: ['RIDE', 'COURIER'], required: true },
    serviceId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: SERVICE_STATUSES.LIABILITY, default: 'PENDING', index: true },
    dueAt: { type: Date, required: true },
    settledAt: { type: Date },
    waivedAt: { type: Date },
    reason: { type: String, trim: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

platformFeeLiabilitySchema.index({ serviceType: 1, serviceId: 1 }, { unique: true });
platformFeeLiabilitySchema.index({ driverId: 1, status: 1 });

export default mongoose.model('PlatformFeeLiability', platformFeeLiabilitySchema);
