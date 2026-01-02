import { prisma } from "@/lib/prisma";
import type { Prisma, Profile } from "../../generated/prisma/client";

export class ProfileRepo {
  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return prisma.profile.create({ data });
  }

  async findById(id: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Profile[]> {
    return prisma.profile.findMany({ where: { userId } });
  }

  async update(id: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
    return prisma.profile.update({
      where: { id },
      data,
    });
  }
}
