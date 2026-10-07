import mongoose from 'mongoose';

const { Schema } = mongoose;

const driverWalletSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    availableBalance: { type: Number, default: 0, min: 0 },
    pendingBalance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0, min: 0 },
    totalWithdrawn: { type: Number, default: 0, min: 0 }
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model('DriverWallet', driverWalletSchema);
