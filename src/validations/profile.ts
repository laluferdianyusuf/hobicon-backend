import { z } from "zod";

export const createProfileSchema = z.object({
  fullName: z.string().min(3),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  school: z.string().optional(),
  level: z.string().optional(),
});

export const updateProfileSchema = createProfileSchema.partial();
