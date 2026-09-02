import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  questionId: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'difficult';
  type: 'mcq' | 'true_false' | 'sequence' | 'drag_and_drop' | 'visual';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  items?: any[];
  draggableItems?: any[];
  correctOrder?: string[];
  imageUrl?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionId: { type: Number, required: true, unique: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'difficult'],
    },
    type: {
      type: String,
      required: true,
      enum: ['mcq', 'true_false', 'sequence', 'drag_and_drop', 'visual'],
    },
    question: { type: String, required: true },
    options: { type: [String] },
    correctAnswer: { type: String, required: false },
    correctSequence: { type: [String] },
    explanation: { type: String },
    items: { type: [Schema.Types.Mixed] },
    draggableItems: { type: [Schema.Types.Mixed] },
    correctOrder: { type: [String] },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model<IQuestion>('Question', QuestionSchema);



