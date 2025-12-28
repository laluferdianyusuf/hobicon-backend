import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["STUDENT", "COACH"]).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8),
});
