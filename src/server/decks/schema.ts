import { z } from "zod";

const descriptionField = z
  .string()
  .trim()
  .max(140, "Keep descriptions under 140 characters")
  .optional()
  .transform((value) => (value ? value : undefined));

export const deckBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title should be at least 2 characters")
    .max(80, "Keep titles under 80 characters"),
  description: descriptionField,
});

export const deckWithCardSchema = deckBaseSchema.extend({
  firstCard: z
    .object({
      question: z.string().trim().min(1, "Question is required"),
      answer: z.string().trim().min(1, "Answer is required"),
    })
    .optional(),
});

export const deckUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title should be at least 2 characters")
      .max(80, "Keep titles under 80 characters")
      .optional(),
    description: descriptionField,
    isArchived: z.boolean().optional(),
  })
  .refine(
    (payload) =>
      payload.title !== undefined ||
      payload.description !== undefined ||
      payload.isArchived !== undefined,
    { message: "Provide at least one field to update" }
  );

export type DeckBaseInput = z.infer<typeof deckBaseSchema>;
export type DeckWithCardInput = z.infer<typeof deckWithCardSchema>;
export type DeckUpdateInput = z.infer<typeof deckUpdateSchema>;
