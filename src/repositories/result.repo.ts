import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export class ResultRepo {
  create(data: Prisma.ResultCreateInput) {
    return prisma.result.create({ data });
  }

  findById(id: string) {
    return prisma.result.findUnique({ where: { id } });
  }

  findByRegistration(registrationId: string) {
    return prisma.result.findUnique({ where: { registrationId } });
  }

  update(id: string, data: Prisma.ResultUpdateInput) {
    return prisma.result.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.result.delete({ where: { id } });
  }

  async findByRegistrationId(registrationId: string) {
    return prisma.result.findUnique({
      where: { registrationId },
      include: { files: true },
    });
  }
}
