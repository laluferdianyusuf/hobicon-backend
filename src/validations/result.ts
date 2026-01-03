import { z } from "zod";

export const createResultSchema = z.object({
  registrationId: z.string().uuid(),
  score: z.number().optional(),
  rank: z.number().int().optional(),
  passed: z.boolean().optional(),
  judgeNotes: z.string().optional(),
});

export const updateResultSchema = z.object({
  score: z.number().optional(),
  rank: z.number().int().optional(),
  passed: z.boolean().optional(),
  judgeNotes: z.string().optional(),
});
