import { prisma } from "@/server/db/client";

export async function getDecksForUser(userId: string) {
  return prisma.deck.findMany({
    where: { userId, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { cards: true } },
    },
  });
}

export async function getDeckById(deckId: string, userId: string) {
  return prisma.deck.findFirst({
    where: { id: deckId, userId },
    include: {
      cards: {
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          question: true,
          answer: true,
          dueAt: true,
          repetition: true,
        },
      },
      _count: { select: { cards: true } },
    },
  });
}
