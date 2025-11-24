import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_MAX_AGE_DAYS: z.coerce.number().int().positive().default(30),
});

const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_MAX_AGE_DAYS: process.env.SESSION_MAX_AGE_DAYS ?? "30",
});

export const env = {
  ...serverEnv,
};
