import { NextRequest, NextResponse } from 'next/server';
import rawQuestions from '../../../../questions.json';

export const dynamic = 'force-dynamic';

// Map raw JSON to frontend format
const questions = (rawQuestions as any[]).map((q, i) => {
  let mappedType = 'multiple_choice';
  if (q.type === 'mcq') mappedType = 'multiple_choice';
  if (q.type === 'sequence') mappedType = 'sequence';
  if (q.type === 'text' || q.type === 'text_input') mappedType = 'text_input';

  let cAnswer = q.correctAnswer;
  if (q.options && typeof q.correctIndex === 'number') {
    cAnswer = q.options[q.correctIndex];
  }

  return {
    questionId: String(q.id || q.questionId || `q_${i}`),
    category: q.category || 'general',
    difficulty: q.difficulty || 'standard',
    type: mappedType,
    question: q.prompt || q.question || 'Missing question',
    options: q.options || [],
    correctAnswer: cAnswer,
    pool: q.pool || q.category || 'general',
    explanation: q.explanation
  };
});

// Helper to filter in memory
function getQuestionsLocal(
  category: string | null,
  difficultyReq: string | null,
  limitStr: string | null,
  excludeStr: string | null,
  poolReq: string | null
) {
  let filtered = [...questions];

  if (category && category !== 'all') {
    filtered = filtered.filter(q => q.category === category);
  }
  if (poolReq) {
    filtered = filtered.filter(q => q.pool === poolReq);
  }
  if (excludeStr) {
    const excludedIds = excludeStr.split(',').filter(x => x);
    filtered = filtered.filter(q => !excludedIds.includes(q.questionId));
  }

  // Handle difficulty matching logic (medium/difficult maps to advanced, easy to standard/easy)
  if (difficultyReq) {
    filtered = filtered.filter(q => {
      const dbDiff = q.difficulty.toLowerCase();
      if (difficultyReq === 'easy' && (dbDiff === 'standard' || dbDiff === 'easy')) return true;
      if (difficultyReq === 'medium' && (dbDiff === 'medium' || dbDiff === 'advanced')) return true;
      if ((difficultyReq === 'difficult' || difficultyReq === 'hard') && 
          (dbDiff === 'hard' || dbDiff === 'difficult' || dbDiff === 'advanced')) return true;
      return dbDiff === difficultyReq;
    });
  }

  // Shuffle array
  filtered = filtered.sort(() => Math.random() - 0.5);

  const limit = parseInt(limitStr || '10', 10);
  return filtered.slice(0, limit);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit');
    const random = searchParams.get('random');
    const exclude = searchParams.get('exclude');
    const pool = searchParams.get('pool');
    const batch = searchParams.get('batch');

    if (batch === '20_fixed') {
      const excludeIds = exclude ? exclude.split(',').filter(x => x) : [];
      let currentExclude = [...excludeIds];
      
      const getSet = (eCount: number, mCount: number, hCount: number) => {
        const e = getQuestionsLocal(category, 'easy', eCount.toString(), currentExclude.join(','), pool);
        currentExclude.push(...e.map(q => q.questionId));
        
        const m = getQuestionsLocal(category, 'medium', mCount.toString(), currentExclude.join(','), pool);
        currentExclude.push(...m.map(q => q.questionId));
        
        const h = getQuestionsLocal(category, 'difficult', hCount.toString(), currentExclude.join(','), pool);
        currentExclude.push(...h.map(q => q.questionId));
        
        let combined = [...e, ...m, ...h];
        if (combined.length < (eCount + mCount + hCount)) {
          const fallbackCount = ((eCount + mCount + hCount) - combined.length).toString();
          const fallback = getQuestionsLocal(category, null, fallbackCount, currentExclude.join(','), pool);
          currentExclude.push(...fallback.map(q => q.questionId));
          combined = [...combined, ...fallback];
        }
        return combined;
      };

      const set1 = getSet(7, 1, 1);
      const set2 = getSet(7, 1, 1);
      const set3 = getSet(2, 0, 0);

      const combined = [...set1, ...set2, ...set3];
      return NextResponse.json({ success: true, data: combined });
    }

    if (batch === '711') {
      // Simplified version just in case
      let currentExclude = exclude ? exclude.split(',').filter(x => x) : [];
      const easy = getQuestionsLocal(category, 'easy', '7', currentExclude.join(','), pool);
      currentExclude.push(...easy.map(q => q.questionId));
      
      const medium = getQuestionsLocal(category, 'medium', '1', currentExclude.join(','), pool);
      currentExclude.push(...medium.map(q => q.questionId));
      
      const hard = getQuestionsLocal(category, 'hard', '1', currentExclude.join(','), pool);
      
      let combined = [...easy, ...medium, ...hard];
      if (combined.length < 9) {
        currentExclude.push(...hard.map(q => q.questionId));
        const fallbackCount = (9 - combined.length).toString();
        const fallback = getQuestionsLocal(category, null, fallbackCount, currentExclude.join(','), pool);
        combined = [...combined, ...fallback];
      }

      combined = combined.sort(() => Math.random() - 0.5);
      return NextResponse.json({ success: true, data: combined });
    }

    const fetchedQuestions = getQuestionsLocal(category, difficulty, limit, exclude, pool);
    return NextResponse.json({ success: true, data: fetchedQuestions });
  } catch (error: any) {
    console.error('[API] GET /api/questions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
