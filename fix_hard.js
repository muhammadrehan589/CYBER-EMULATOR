const fs = require('fs');
let data = require('./src/data/questions.json');

data.questions.forEach(q => {
  if (q.difficulty === 'hard') {
    q.difficulty = 'difficult';
  }
});

fs.writeFileSync('./src/data/questions.json', JSON.stringify(data, null, 4));
console.log('Fixed difficulty enum');
