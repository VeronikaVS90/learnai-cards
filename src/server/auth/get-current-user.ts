import { cookies } from "next/headers";

import { getSessionWithUser } from "@/server/auth/session";
import { SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { toPublicUser } from "@/server/auth/user";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }

  const session = await getSessionWithUser(sessionToken);
  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return toPublicUser(session.user);
}
