import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionLog {
  questionId: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface IQuizSession extends Document {
  empId: string;
  startedAt: Date;
  completedAt?: Date;
  finalScore: number;
  highestStreak: number;
  questionsPlayed: number[];
  sessionLogs: ISessionLog[];
}

const SessionLogSchema = new Schema<ISessionLog>(
  {
    questionId: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, required: true },
  },
  { _id: false }
);

const QuizSessionSchema = new Schema<IQuizSession>(
  {
    empId: { type: String, required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    finalScore: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    questionsPlayed: { type: [Number], default: [] },
    sessionLogs: { type: [SessionLogSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.QuizSession ||
  mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema);
