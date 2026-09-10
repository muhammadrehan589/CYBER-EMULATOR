import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  questionId: number;
  category: 'Threat Assessments' | 'Trick Questions' | 'Enterprise Use-Cases' | 'Sequence Challenges' | 'Text Prompts';
  difficulty: 'easy' | 'medium' | 'difficult';
  type: 'multiple_choice' | 'sequence' | 'text_input';
  question: string;
  // For multiple_choice
  options?: string[];
  correctAnswer?: string;
  // For sequence
  items?: any[];
  correctOrder?: string[];
  // For text_input
  keywords?: string[];
  explanation: string;
  imageUrl?: string;
  pool?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionId: { type: Number, required: true, unique: true },
    category: { 
      type: String, 
      required: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'difficult'],
    },
    type: {
      type: String,
      required: true,
      enum: ['multiple_choice', 'sequence', 'text_input'],
    },
    question: { type: String, required: true },
    options: { type: [String] },
    correctAnswer: { type: String },
    items: { type: [Schema.Types.Mixed] },
    correctOrder: { type: [String] },
    keywords: { type: [String] },
    explanation: { type: String },
    imageUrl: { type: String },
    pool: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
