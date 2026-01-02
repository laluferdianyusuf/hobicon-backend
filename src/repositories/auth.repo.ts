import { prisma } from "@/lib/prisma";
import type { Prisma, User } from "../../generated/prisma/client";

export class AuthRepo {
  async register(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async fetchUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email } });
  }

  async fetchUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
