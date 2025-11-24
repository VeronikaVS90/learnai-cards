import { randomBytes } from "node:crypto";
import { addDays } from "date-fns";
import { Session } from "@prisma/client";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

import { env } from "@/env";
import { prisma } from "@/server/db/client";
import { SESSION_COOKIE_NAME } from "@/server/auth/constants";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = addDays(new Date(), env.SESSION_MAX_AGE_DAYS);

  return prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

export async function deleteSession(token: string) {
  await prisma.session
    .delete({
      where: { token },
    })
    .catch(() => {});
}

export async function getSessionWithUser(token: string) {
  return prisma.session.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });
}

export function attachSessionCookie(
  cookies: ResponseCookies,
  session: Session
) {
  cookies.set(SESSION_COOKIE_NAME, session.token, {
    ...COOKIE_OPTIONS,
    expires: session.expiresAt,
  });
}

export function clearSessionCookie(cookies: ResponseCookies) {
  cookies.delete(SESSION_COOKIE_NAME);
}
