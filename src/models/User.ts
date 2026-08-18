import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  empId: string;
  name: string;
  username: string;
  email?: string;
  passwordHash?: string;
  department: string;
  role: 'Admin' | 'Player' | 'VIP' | 'Guard';
  status: 'active' | 'suspended';
  score: number;
  joinedAt: Date;
  activeAvatar: Record<string, any>;
  wardrobe: Record<string, any>[];
  unlockedOutfits: string[];
}

const UserSchema = new Schema<IUser>(
  {
    empId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, sparse: true },
    passwordHash: { type: String },
    department: { type: String, default: 'Operations' },
    role: {
      type: String,
      enum: ['Admin', 'Player', 'VIP', 'Guard'],
      default: 'Player',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    activeAvatar: { type: Schema.Types.Mixed, default: {} },
    wardrobe: { type: [Schema.Types.Mixed], default: [] },
    unlockedOutfits: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
