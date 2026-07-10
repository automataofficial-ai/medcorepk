// SM-2 Algorithm for Spaced Repetition
// Developed by Piotr Wozniak

export interface RepetitionCard {
  id: string;
  question_id: string;
  interval: number; // days until next review
  easeFactor: number; // difficulty multiplier (1.3 - 2.5)
  repetitions: number; // number of times reviewed
  nextReviewDate: Date;
  lastReviewDate: Date | null;
  quality: number; // 0-5: quality of last review
}

export interface SM2Response {
  quality: number; // 0 = complete blackout, 5 = perfect response
}

/**
 * SM-2 Algorithm: Calculate next review interval
 * Based on: https://www.supermemo.com/english/ol_sm2.htm
 */
export function calculateSM2(
  card: RepetitionCard,
  quality: number // 0-5 rating of answer quality
): RepetitionCard {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }

  let { easeFactor, repetitions, interval } = card;

  // EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor =
    easeFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure EF doesn't go below 1.3
  const adjustedEF = Math.max(1.3, newEaseFactor);

  let newInterval: number;
  let newRepetitions = repetitions;

  if (quality < 3) {
    // If quality < 3 (incorrect/learning), reset
    newInterval = 1;
    newRepetitions = 0;
  } else {
    newRepetitions++;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 3;
    } else {
      // I(n) := I(n-1) * EF'
      newInterval = Math.round(interval * adjustedEF);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    ...card,
    interval: newInterval,
    easeFactor: adjustedEF,
    repetitions: newRepetitions,
    nextReviewDate,
    lastReviewDate: new Date(),
    quality,
  };
}

/**
 * Get cards due for review
 */
export function getCardsDueForReview(
  cards: RepetitionCard[],
  maxCards: number = 50
): RepetitionCard[] {
  const now = new Date();
  return cards
    .filter((card) => card.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime())
    .slice(0, maxCards);
}

/**
 * Create new repetition card for a question
 */
export function createNewCard(questionId: string): RepetitionCard {
  return {
    id: `card-${questionId}-${Date.now()}`,
    question_id: questionId,
    interval: 0,
    easeFactor: 2.5, // Initial ease factor
    repetitions: 0,
    nextReviewDate: new Date(), // Review immediately
    lastReviewDate: null,
    quality: 0,
  };
}

/**
 * Calculate study statistics
 */
export function calculateStudyStats(cards: RepetitionCard[]) {
  const now = new Date();
  const dueCards = cards.filter((c) => c.nextReviewDate <= now);
  const reviewedCards = cards.filter((c) => c.repetitions > 0);
  const masterCards = cards.filter((c) => c.repetitions >= 5);
  const learningCards = cards.filter(
    (c) => c.repetitions > 0 && c.repetitions < 3
  );

  const avgEaseFactor =
    reviewedCards.length > 0
      ? reviewedCards.reduce((sum, c) => sum + c.easeFactor, 0) /
        reviewedCards.length
      : 2.5;

  return {
    total: cards.length,
    due: dueCards.length,
    reviewed: reviewedCards.length,
    mastered: masterCards.length,
    learning: learningCards.length,
    avgEaseFactor: Math.round(avgEaseFactor * 100) / 100,
    duePercentage: Math.round((dueCards.length / cards.length) * 100),
  };
}

/**
 * Quality rating helper (for UI)
 */
export const QUALITY_RATINGS = {
  0: {
    label: "Complete blackout",
    description: "Total failure to recall",
    color: "red",
  },
  1: {
    label: "Incorrect",
    description: "Incorrect response; the correct one is still vividly recalled",
    color: "red",
  },
  2: {
    label: "Incorrect but close",
    description:
      "Incorrect response, but upon seeing correct answer it is remembered",
    color: "orange",
  },
  3: {
    label: "Hesitant correct",
    description: "Correct response after some hesitation",
    color: "yellow",
  },
  4: {
    label: "Perfect with difficulty",
    description: "Correct response after serious difficulty",
    color: "lime",
  },
  5: {
    label: "Perfect",
    description: "Perfect response",
    color: "green",
  },
};
