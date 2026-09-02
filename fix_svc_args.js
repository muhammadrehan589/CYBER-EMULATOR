const fs = require('fs');
let content = fs.readFileSync('src/services/QuestionService.ts', 'utf8');
content = content.replace(
  /async getQuestions\\(category\?: string \\| null, difficulty\?: string \\| null, limit\?: string \\| null, random\?: string \\| null\\)/,
  "async getQuestions(category?: string | null, difficulty?: string | null, limit?: string | null, random?: string | null, exclude?: string | null)"
);
fs.writeFileSync('src/services/QuestionService.ts', content);
console.log('Fixed QuestionService args');
