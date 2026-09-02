require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI.replace(/"/g, '');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true, unique: true },
  draggableItems: { type: [mongoose.Schema.Types.Mixed] },
}, { strict: false });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function patchQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const questionsPath = path.resolve(__dirname, '..', 'src', 'data', 'questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

    let count = 0;
    for (const q of questionsData.questions) {
      if (q.draggableItems) {
        await Question.updateOne(
          { questionId: q.id },
          { $set: { draggableItems: q.draggableItems } }
        );
        count++;
      }
    }
    
    console.log(`Patched ${count} questions with draggableItems.`);
    process.exit(0);
  } catch (error) {
    console.error('Error patching:', error);
    process.exit(1);
  }
}

patchQuestions();
