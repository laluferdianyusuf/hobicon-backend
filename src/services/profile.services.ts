import { ProfileRepo } from "@/repositories/profile.repo";
import { HttpError } from "@/utils/http.error";
import type { Profile } from "../../generated/prisma/client";

type ProfileCreateInput = Omit<
  Profile,
  "id" | "userId" | "createdAt" | "updatedAt" | "verified"
>;

type ProfileUpdateInput = Partial<ProfileCreateInput>;

export class ProfileServices {
  private profileRepo: ProfileRepo;

  constructor() {
    this.profileRepo = new ProfileRepo();
  }

  async create(userId: string, data: ProfileCreateInput) {
    return this.profileRepo.create({
      fullName: data.fullName,
      gender: data.gender,
      school: data.school,
      level: data.level,
      birthDate: data.birthDate ?? null,
      user: { connect: { id: userId } },
    });
  }

  async getMyProfiles(userId: string) {
    return this.profileRepo.findByUserId(userId);
  }

  async getById(id: string) {
    const profile = await this.profileRepo.findById(id);

    if (!profile) throw new HttpError("Profile not found", 404);

    return profile;
  }

  async update(id: string, userId: string, data: ProfileUpdateInput) {
    const existing = await this.getById(id);

    if (existing.userId !== userId) throw new HttpError("Forbidden", 403);

    return this.profileRepo.update(id, {
      ...(data.fullName !== undefined && { fullName: data.fullName }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.school !== undefined && { school: data.school }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.birthDate !== undefined && {
        birthDate: data.birthDate ?? null,
      }),
    });
  }
}
