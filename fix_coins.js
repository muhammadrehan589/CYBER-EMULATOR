const fs = require('fs');
let content = fs.readFileSync('src/store/quizStore.ts', 'utf8');
content = content.replace(
  /set\\(state => \\(\\{ coinsEarned: state\.coinsEarned \+ amount \\}\\)\\);/,
  "set(state => ({ coinsEarned: Math.max(0, state.coinsEarned + amount) }));"
);
fs.writeFileSync('src/store/quizStore.ts', content);
console.log('Fixed addCoins to prevent negative balance');
