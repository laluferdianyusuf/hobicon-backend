import { HttpError } from "@/utils/http.error";
import { ResultRepo } from "@/repositories/result.repo";
import { RegistrationRepo } from "@/repositories";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/utils/image";

export class ResultServices {
  private repo = new ResultRepo();
  private registrationRepo = new RegistrationRepo();

  async createResult(data: {
    registrationId: string;
    eventId: string;
    score?: number | null;
    rank?: number | null;
    passed?: boolean | null;
    judgeNotes?: string | null;
    file?: Express.Multer.File | null;
  }) {
    let fileUrl: string | null = null;

    if (data.file) {
      fileUrl = await uploadToCloudinary(data.file.path, "results");
    }

    return prisma.$transaction(async (tx) => {
      const registration = await tx.registration.findUnique({
        where: { id: data.registrationId },
      });

      if (!registration) throw new HttpError("Registration not found", 404);

      const result = await tx.result.create({
        data: {
          registrationId: data.registrationId,
          eventId: data.eventId,
          ...(data.score != null && { score: data.score }),
          ...(data.rank != null && { rank: data.rank }),
          ...(data.passed != null && { passed: data.passed }),
          ...(data.judgeNotes != null && { judgeNotes: data.judgeNotes }),
        },
      });

      if (fileUrl) {
        await tx.resultFile.create({
          data: {
            resultId: result.id,
            url: fileUrl,
            fileType: "IMAGE",
          },
        });
      }

      await tx.certificate.create({
        data: {
          registrationId: data.registrationId,
          type: "PARTICIPANT",
          fileUrl: "",
        },
      });

      return result;
    });
  }

  async update(
    id: string,
    data: {
      score?: number;
      rank?: number;
      passed?: boolean;
      judgeNotes?: string;
    }
  ) {
    const result = await this.repo.findById(id);
    if (!result) throw new HttpError("Result not found", 404);

    return this.repo.update(id, {
      ...(data.score !== null && { score: data.score }),
      ...(data.rank !== null && { rank: data.rank }),
      ...(data.passed !== null && { passed: data.passed }),
      ...(data.judgeNotes !== null && { judgeNotes: data.judgeNotes }),
    });
  }

  async delete(id: string) {
    const result = await this.repo.findById(id);
    if (!result) throw new HttpError("Result not found", 404);

    return this.repo.delete(id);
  }
}
