import { prisma } from "@/server/db/client";
import {
  DeckBaseInput,
  DeckUpdateInput,
  DeckWithCardInput,
} from "@/server/decks/schema";

class DeckAccessError extends Error {
  constructor() {
    super("Deck not found");
    this.name = "DeckAccessError";
  }
}

async function assertDeckOwner(deckId: string, userId: string) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId } });
  if (!deck || deck.userId !== userId) {
    throw new DeckAccessError();
  }
  return deck;
}

export async function createDeck(userId: string, input: DeckWithCardInput) {
  const { title, description, firstCard } = input;

  return prisma.deck.create({
    data: {
      title,
      description: description ?? null,
      userId,
      cards: firstCard
        ? {
            create: {
              question: firstCard.question,
              answer: firstCard.answer,
              userId,
            },
          }
        : undefined,
    },
    include: { _count: { select: { cards: true } } },
  });
}

export async function createSimpleDeck(userId: string, input: DeckBaseInput) {
  return createDeck(userId, input);
}

export async function updateDeck(
  deckId: string,
  userId: string,
  input: DeckUpdateInput
) {
  await assertDeckOwner(deckId, userId);

  return prisma.deck.update({
    where: { id: deckId },
    data: {
      title: input.title,
      description:
        input.description === undefined ? undefined : input.description ?? null,
      isArchived: input.isArchived,
    },
    include: {
      _count: { select: { cards: true } },
    },
  });
}

export async function deleteDeck(deckId: string, userId: string) {
  await assertDeckOwner(deckId, userId);
  await prisma.deck.delete({ where: { id: deckId } });
}
