import { NextResponse } from "next/server";

import { getCurrentUser } from "@/server/auth/get-current-user";
import { createSimpleDeck } from "@/server/decks/mutations";
import { getDecksForUser } from "@/server/decks/queries";
import { deckBaseSchema } from "@/server/decks/schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decks = await getDecksForUser(user.id);
  return NextResponse.json({ decks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = deckBaseSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const deck = await createSimpleDeck(user.id, parsed.data);
  return NextResponse.json({ deck }, { status: 201 });
}
