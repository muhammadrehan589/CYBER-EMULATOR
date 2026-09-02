const fs = require('fs');

let s = fs.readFileSync('src/services/QuestionService.ts', 'utf8');
s = s.replace(/getQuestions\(category: string \| null, difficulty: string \| null, limit: string \| null, random: string \| null\)/,
  'getQuestions(category: string | null, difficulty: string | null, limit: string | null, random: string | null, exclude: string | null = null)');
s = s.replace(/const questions = await this\.questionRepository\.getRandomQuestions\(filter, parsedLimit\);/,
  `if (exclude) {
        const ids = exclude.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
        if (ids.length > 0) filter.questionId = { $nin: ids };
      }
      const questions = await this.questionRepository.getRandomQuestions(filter, parsedLimit);`
);
fs.writeFileSync('src/services/QuestionService.ts', s);

console.log('Fixed services');
