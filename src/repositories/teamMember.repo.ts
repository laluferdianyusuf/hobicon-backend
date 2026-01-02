import { prisma } from "@/lib/prisma";

export class TeamMemberRepo {
  async add(teamId: string, profileId: string) {
    return prisma.teamMember.create({
      data: { teamId, profileId },
    });
  }

  async remove(teamId: string, profileId: string) {
    return prisma.teamMember.deleteMany({
      where: { teamId, profileId },
    });
  }

  async exists(teamId: string, profileId: string) {
    return prisma.teamMember.findFirst({
      where: { teamId, profileId },
    });
  }
}
