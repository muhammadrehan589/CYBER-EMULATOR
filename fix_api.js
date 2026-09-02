const fs = require('fs');
let content = fs.readFileSync('src/app/api/questions/route.ts', 'utf8');

content = content.replace(
  /const random = searchParams\.get\('random'\);/,
  "const random = searchParams.get('random');\n    const exclude = searchParams.get('exclude');"
);
content = content.replace(
  /const questions = await questionService\.getQuestions\(category, difficulty, limit, random\);/,
  "const questions = await questionService.getQuestions(category, difficulty, limit, random, exclude);"
);

fs.writeFileSync('src/app/api/questions/route.ts', content);
console.log('Fixed api/questions/route.ts');
