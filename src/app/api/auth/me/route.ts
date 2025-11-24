import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { getCurrentUser } from "@/server/auth/get-current-user";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    const response = NextResponse.json(
      { user: null, error: "Unauthenticated" },
      { status: 401 }
    );
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ user });
}
