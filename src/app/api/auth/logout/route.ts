import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { clearSessionCookie, deleteSession } from "@/server/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSession(token).catch(() => {});
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response.cookies);

  return response;
}
