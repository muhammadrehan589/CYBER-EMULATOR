const fs = require('fs');
let c = fs.readFileSync('src/app/api/questions/route.ts', 'utf-8');

const regex = /return \{\s*questionId:[\s\S]*?explanation: q\.explanation\s*\};/;

const newReturn = `
  let items = [];
  let draggableItems = [];
  let correctOrder = [];

  if (mappedType === 'sequence' && q.correctSequence) {
    items = q.correctSequence.map((text, idx) => ({
      id: \`seq_\${idx}\`,
      content: text
    }));
    correctOrder = items.map(i => i.id);
    draggableItems = [...items].sort(() => Math.random() - 0.5);
  }

  return {
    questionId: String(q.id || q.questionId || \`q_\${i}\`),
    category: q.category || 'general',
    difficulty: q.difficulty || 'standard',
    type: mappedType,
    question: q.prompt || q.question || 'Missing question',
    options: q.options || [],
    correctAnswer: cAnswer,
    pool: q.pool || q.category || 'general',
    explanation: q.explanation,
    items,
    draggableItems,
    correctOrder
  };`;

if (regex.test(c)) {
  c = c.replace(regex, newReturn);
  fs.writeFileSync('src/app/api/questions/route.ts', c, 'utf-8');
  console.log('Fixed route.ts sequence return logic.');
} else {
  console.log('Regex failed.');
}
