const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

const oldHandleActionRegex = /const handleAction = \(\) => \{[\s\S]*?\}\s*else\s*\{\s*setSoloQuestionIndex\(prev => prev \+ 1\);\s*\}\s*\}\s*\};/;

const newHandleAction = `const handleAction = () => {
    if (!isSubmitted) {
      if (!selectedOption) return;
      submitAnswer(selectedOption);
    } else {
      // --- WAGER RESOLUTION ---
      if (isWagerActive) {
        if (isCorrect) {
          useQuizStore.getState().addCoins(wagerAmount.coins);
          useQuizStore.getState().addXP(wagerAmount.xp);
          alert(\`WAGER WON! You doubled your streak earnings: +\${wagerAmount.coins} Coins, +\${wagerAmount.xp} XP!\`);
        } else {
          useQuizStore.getState().deductXP(wagerAmount.xp);
          useQuizStore.getState().addCoins(-wagerAmount.coins);
          alert(\`WAGER LOST! The Matrix reclaimed your recent earnings: -\${wagerAmount.coins} Coins, -\${wagerAmount.xp} XP.\`);
        }
        setIsWagerActive(false);
      }

      // Log question ID to the permanent burn list
      const burnedQuestions = JSON.parse(localStorage.getItem('burned_questions') || '[]');
      if (activeQuestion && !burnedQuestions.includes(activeQuestion.id)) {
        burnedQuestions.push(activeQuestion.id);
        localStorage.setItem('burned_questions', JSON.stringify(burnedQuestions));
      }

      setSelectedOption(null);
      setIsSubmitted(false);
      setIsTimeout(false);
      setEliminatedOptions([]);
      
      // Call store for score/streak/multiplier side-effects only
      if (!isCorrect && useQuizStore.getState().inventory.shields > 0) {
         useQuizStore.getState().consumeItem('shields');
         advanceQuestion(true, 0); // Shield prevents streak loss
      } else {
         advanceQuestion(isCorrect || false, 10);
      }

      // --- WAGER TRIGGER ---
      const newStreak = useQuizStore.getState().streak;
      if (newStreak > 0 && newStreak % 5 === 0 && !wagerOffered && !isWagerActive) {
         setWagerAmount({ coins: 50, xp: 100 });
         setWagerOffered(true);
         return; // Pause advancement for the popup
      }

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
    }
  };

  const handleWagerDecision = (accept: boolean) => {
    setWagerOffered(false);
    if (accept) {
      setIsWagerActive(true);
    }
    // Proceed to next question
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
  };`;

content = content.replace(oldHandleActionRegex, newHandleAction);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed handleAction completely!');
