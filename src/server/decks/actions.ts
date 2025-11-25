"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../db/client";
import { getCurrentUser } from "../auth/get-current-user";

const deckInputSchema = z.object({
  title: z.string().min(2, "Name your deck"),
  description: z.string().max(140).optional(),
  firstCard: z
    .object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
    .optional(),
});

export async function completeOnboarding(
  input: z.infer<typeof deckInputSchema>
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const payload = deckInputSchema.parse(input);

  const deck = await prisma.deck.create({
    data: {
      title: payload.title,
      description: payload.description,
      userId: user.id,
      cards: payload.firstCard
        ? {
            create: {
              question: payload.firstCard.question,
              answer: payload.firstCard.answer,
              userId: user.id,
            },
          }
        : undefined,
    },
  });

  revalidatePath("/decks");
  return { deckId: deck.id };
}
