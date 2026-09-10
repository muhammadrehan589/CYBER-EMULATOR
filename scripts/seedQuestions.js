const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env.local' });
dotenv.config();

// We use the existing schema but assume it matches the JSON structure
const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String] },
  correctAnswer: { type: String },
  items: { type: [mongoose.Schema.Types.Mixed] },
  correctOrder: { type: [String] },
  keywords: { type: [String] },
  explanation: { type: String },
  pool: { type: String }
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  await Question.deleteMany({});
  console.log('Cleared existing questions');

  const jsonPath = path.join(__dirname, '..', 'questions.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: Could not find ${jsonPath}. Please paste the file and run this script again.`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  let questions = JSON.parse(fileData);

  // Map user JSON format to our schema
  questions = questions.map((q, i) => {
    let mappedType = 'multiple_choice';
    if (q.type === 'mcq') mappedType = 'multiple_choice';
    if (q.type === 'sequence') mappedType = 'sequence';
    if (q.type === 'text' || q.type === 'text_input') mappedType = 'text_input';

    let cAnswer = q.correctAnswer;
    if (q.options && q.correctIndex !== undefined) {
      cAnswer = q.options[q.correctIndex];
    }

    // Map sequence items format if they provided it differently
    let mappedItems = q.items;
    let mappedCorrectOrder = q.correctOrder;
    
    if (mappedType === 'sequence' && q.scrambledSteps) {
       mappedItems = q.scrambledSteps.map((step, idx) => ({
         id: `step_${idx}`,
         content: step
       }));
       
       mappedCorrectOrder = (q.correctOrder || []).map(correctStr => {
         const matchingItem = mappedItems.find(item => item.content === correctStr);
         return matchingItem ? matchingItem.id : null;
       }).filter(id => id !== null);
    }

    return {
      questionId: i + 1,
      category: q.category || 'Threat Assessments',
      difficulty: q.difficulty || 'medium',
      type: mappedType,
      question: q.prompt || q.question || 'Missing question prompt',
      options: q.options || [],
      correctAnswer: cAnswer,
      items: mappedItems || [],
      correctOrder: mappedCorrectOrder || [],
      keywords: q.keywords || [],
      explanation: q.explanation || 'No explanation provided.',
      pool: q.pool || q.category
    };
  });

  await Question.insertMany(questions);
  console.log(`Successfully seeded ${questions.length} questions from new questions.json.`);

  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
