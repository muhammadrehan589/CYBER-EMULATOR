import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  empId: string;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  passwordHash?: string;
  department: string;
  role: 'Admin' | 'Player' | 'VIP' | 'Guard';
  status: 'active' | 'suspended';
  score: number;
  joinedAt: Date;
  activeAvatar: Record<string, any>;
  wardrobe: any[];
  unlockedOutfits: string[];
  coins: number;
  xp: number;
  warningMessage?: string;
  banUntil?: Date;
  forceUsernameChange?: boolean;
  hasSeenTour?: boolean;
  lastUsernameChange?: Date;
  isOnline?: boolean;
  loginHistory?: Date[];
  metrics?: {
    correctAnswers: number;
    wrongAnswers: number;
    duelsPlayed: number;
    duelsWon: number;
  };
}

  const UserSchema = new Schema<IUser>(
    {
      empId: { type: String, unique: true, sparse: true, required: false },
      name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, required: false },
    email: { type: String, sparse: true, required: false },
    password: { type: String },
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
    wardrobe: { type: Schema.Types.Mixed, default: [] },
    unlockedOutfits: { type: [String], default: [] },
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    warningMessage: { type: String, default: null },
    banUntil: { type: Date, default: null },
    forceUsernameChange: { type: Boolean, default: false },
    hasSeenTour: { type: Boolean, default: false },
    lastUsernameChange: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
    loginHistory: [{ type: Date }],
    metrics: {
      correctAnswers: { type: Number, default: 0 },
      wrongAnswers: { type: Number, default: 0 },
      duelsPlayed: { type: Number, default: 0 },
      duelsWon: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', UserSchema);
