const fs = require('fs');
let content = fs.readFileSync('src/app/battle/page.tsx', 'utf8');

content = content.replace(
  /fetch\('\/api\/questions\?random=true&limit=50'\)/,
  "fetch(`/api/questions?random=true&limit=50&exclude=${useQuizStore.getState().playedQuestions.join(',')}`)"
);

// We also need to update playedQuestions locally inside the battle when they answer!
// BUT wait, battle handles its own state, and doesn't push to store.
// If we want to add questions played in battle to global store:
const nextRoundLogic = `
        currentSocket.on('battle_update', (data) => {
          // Track question played!
          if (questions.length > 0 && currentRound < questions.length) {
             const qId = questions[currentRound].id;
             const state = useQuizStore.getState();
             if (!state.playedQuestions.includes(qId)) {
                useQuizStore.setState({ playedQuestions: [...state.playedQuestions, qId] });
             }
          }
`;

content = content.replace(
  /currentSocket\.on\('battle_update', \(data\) => \{/,
  nextRoundLogic.trim()
);

fs.writeFileSync('src/app/battle/page.tsx', content);
console.log('Fixed battle fetching and recording');
