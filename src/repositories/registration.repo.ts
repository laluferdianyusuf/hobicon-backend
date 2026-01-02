import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export class RegistrationRepo {
  create(data: Prisma.RegistrationCreateInput) {
    return prisma.registration.create({ data });
  }

  findById(id: string) {
    return prisma.registration.findUnique({ where: { id } });
  }

  findByEvent(eventId: string) {
    return prisma.registration.findMany({ where: { eventId } });
  }

  findByProfile(eventId: string, profileId: string) {
    return prisma.registration.findFirst({
      where: { eventId, profileId },
    });
  }

  findByTeam(eventId: string, teamId: string) {
    return prisma.registration.findFirst({
      where: { eventId, teamId },
    });
  }

  update(id: string, data: Prisma.RegistrationUpdateInput) {
    return prisma.registration.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.registration.delete({ where: { id } });
  }
}
