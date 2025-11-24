import { Card } from "@prisma/client";

export type Grade = 0 | 1 | 2 | 3;

type SRSState = Pick<Card, "interval" | "easeFactor" | "repetition">;

type UpdatePayload<T extends SRSState> = T & {
  dueAt?: string;
};

/**
 * Applies a simplified SM-2 update to a card after receiving a grade.
 * The input card object is not mutated – a copy with updated SRS fields is returned.
 */
export function updateSRS<T extends UpdatePayload<SRSState>>(
  card: T,
  grade: Grade
): T {
  let { repetition, interval, easeFactor } = card;

  if (grade === 0) {
    repetition = 0;
    interval = 1;
  } else if (grade === 1) {
    interval = Math.max(1, Math.round(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (grade === 2) {
    repetition += 1;
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 3;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
  } else if (grade === 3) {
    repetition += 1;
    easeFactor = Math.max(1.3, easeFactor + 0.15);
    interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
  }

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + interval);

  return {
    ...card,
    repetition,
    interval,
    easeFactor,
    dueAt: dueAt.toISOString(),
  };
}
