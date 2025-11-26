"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/server/auth/get-current-user";
import { createDeck } from "@/server/decks/mutations";
import { deckWithCardSchema } from "@/server/decks/schema";

export async function completeOnboarding(input: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const payload = deckWithCardSchema.parse(input);
  const deck = await createDeck(user.id, payload);

  revalidatePath("/decks");
  return { deckId: deck.id };
}
