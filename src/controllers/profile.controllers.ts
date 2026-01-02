import type { Request, Response } from "express";
import { ProfileServices } from "@/services/profile.services";
import {
  createProfileSchema,
  updateProfileSchema,
} from "@/validations/profile";
import { HttpError } from "@/utils/http.error";

export class ProfileController {
  private profileServices = new ProfileServices();

  async create(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const data = createProfileSchema.parse(req.body);

      const profile = await this.profileServices.create(req.user.id, {
        fullName: data.fullName,
        gender: data.gender ?? null,
        school: data.school ?? null,
        level: data.level ?? null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      });

      res.status(201).json({ success: true, data: profile });
    } catch (error: any) {
      console.error("Create Profile Error:", error);

      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async mine(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const profiles = await this.profileServices.getMyProfiles(req.user.id);

      res.status(200).json({ success: true, data: profiles });
    } catch (error) {
      console.error("Get My Profiles Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async detail(req: Request, res: Response) {
    try {
      const profile = await this.profileServices.getById(
        req.params.id as string
      );

      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const data = updateProfileSchema.parse(req.body);

      const updated = await this.profileServices.update(
        req.params.id as string,
        req.user.id,
        {
          ...(data.fullName !== undefined && { fullName: data.fullName }),
          ...(data.gender !== undefined && { gender: data.gender }),
          ...(data.school !== undefined && { school: data.school }),
          ...(data.level !== undefined && { level: data.level }),
          ...(data.birthDate !== undefined && {
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
          }),
        }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("Update Profile Error:", error);

      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}
