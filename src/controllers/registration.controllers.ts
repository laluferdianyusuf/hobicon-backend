import type { Request, Response } from "express";
import { RegistrationServices } from "@/services/registration.services";
import {
  registerIndividualSchema,
  registerTeamSchema,
  updateRegistrationStatusSchema,
} from "@/validations/registration";
import { HttpError } from "@/utils/http.error";

export class RegistrationController {
  private services = new RegistrationServices();

  async registerIndividual(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const { eventId, profileId } = registerIndividualSchema.parse(req.body);

      const reg = await this.services.registerIndividual(
        req.user.id,
        eventId,
        profileId
      );

      res.status(201).json({ success: true, data: reg });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async registerTeam(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const { eventId, teamId } = registerTeamSchema.parse(req.body);

      const reg = await this.services.registerTeam(
        req.user.id,
        eventId,
        teamId
      );

      res.status(201).json({ success: true, data: reg });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = updateRegistrationStatusSchema.parse(req.body);

      const updated = await this.services.updateStatus(
        req.params.id as string,
        status
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      await this.services.delete(req.params.id as string, req.user.id);

      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res
          .status(error.status)
          .json({ success: false, message: error.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}
