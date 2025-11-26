import { NextResponse } from "next/server";

import { getCurrentUser } from "@/server/auth/get-current-user";
import { deleteDeck, updateDeck } from "@/server/decks/mutations";
import { deckUpdateSchema } from "@/server/decks/schema";

type RouteParams = { params: { deckId: string } };

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = deckUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const deck = await updateDeck(params.deckId, user.id, parsed.data);
    return NextResponse.json({ deck });
  } catch (error) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteDeck(params.deckId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }
}
