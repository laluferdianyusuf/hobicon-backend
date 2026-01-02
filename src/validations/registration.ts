import { z } from "zod";

export const registerIndividualSchema = z.object({
  eventId: z.string().uuid(),
  profileId: z.string().uuid(),
});

export const registerTeamSchema = z.object({
  eventId: z.string().uuid(),
  teamId: z.string().uuid(),
});

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(["REGISTERED", "PAID", "VERIFIED", "CANCELLED"]),
});
