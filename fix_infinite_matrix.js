const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

const replacement = `
        // Advance or reload seamlessly
        if (soloQuestionIndex === questions.length - 1) {
           const burned = JSON.parse(localStorage.getItem('burned_questions') || '[]');
           let fresh = initialQuestions.filter((q: any) => !burned.includes(q.id));
           if (fresh.length === 0) {
              localStorage.removeItem('burned_questions');
              fresh = initialQuestions;
           }
           setQuestions(shuffleArray(fresh).slice(0, 10));
           setSoloQuestionIndex(0);
        } else {
           setSoloQuestionIndex(prev => prev + 1);
        }
`;

content = content.replace(
  /setSoloQuestionIndex\(prev => prev \+ 1\);/,
  replacement.trim()
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed handleAction to load more questions');
