import mongoose from 'mongoose';
import { SERVICE_STATUSES } from '../../../shared/constants/rydaConfig.js';

const { Schema } = mongoose;

const withdrawalRequestSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: SERVICE_STATUSES.WITHDRAWAL, default: 'PENDING', index: true },
    adminNote: { type: String, trim: true },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: false }
);

export default mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
