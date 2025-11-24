import { cookies } from "next/headers";
import { cache } from "react";

import { getSessionWithUser } from "@/server/auth/session";
import { SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { toPublicUser } from "@/server/auth/user";

export const getCurrentUser = cache(async () => {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
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
});
