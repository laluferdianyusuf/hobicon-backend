import { prisma } from "@/lib/prisma";
import type { Prisma, Team } from "../../generated/prisma/client";

export class TeamRepo {
  async create(data: Prisma.TeamCreateInput) {
    return prisma.team.create({ data });
  }

  async findById(id: string) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
        coach: true,
        event: true,
      },
    });
  }

  async findByCoach(userId: string) {
    return prisma.team.findMany({
      where: { coachUserId: userId },
      include: {
        event: true,
        members: { include: { profile: true } },
      },
    });
  }

  async update(id: string, data: Prisma.TeamUpdateInput) {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.team.delete({ where: { id } });
  }
}
