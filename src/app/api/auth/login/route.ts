import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/db/client";
import {
  attachSessionCookie,
  createSession,
  deleteSession,
} from "@/server/auth/session";
import { SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { toPublicUser } from "@/server/auth/user";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ user: toPublicUser(user) });

  const cookieStore = cookies();
  const existingToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existingToken) {
    await deleteSession(existingToken).catch(() => {});
  }

  const session = await createSession(user.id);
  attachSessionCookie(response.cookies, session);

  return response;
}
