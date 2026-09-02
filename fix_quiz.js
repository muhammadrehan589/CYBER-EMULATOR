const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

const replacement = `
    const played = useQuizStore.getState().playedQuestions || [];
    let available = initialQuestions.filter(q => !played.includes(q.id));
    if (available.length < 10) available = initialQuestions; // Reset if out of questions
    const freshShuffle = shuffleArray(available).slice(0, 10);
`;

content = content.replace(
  /const freshShuffle = shuffleArray\(initialQuestions\)\.slice\(0, 10\);/,
  replacement.trim()
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed QuizEngine to not repeat questions');
