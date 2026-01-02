import type { Request, Response } from "express";
import { TeamServices } from "@/services/team.services";
import { HttpError } from "@/utils/http.error";

export class TeamController {
  private teamServices = new TeamServices();

  async create(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const { name, eventId } = req.body;

      const team = await this.teamServices.create(req.user.id, {
        name,
        eventId,
      } as any);

      res.status(201).json({ success: true, data: team });
    } catch (error: any) {
      console.error("Create Team Error:", error);

      if (error instanceof HttpError)
        return res.status(error.status).json({ message: error.message });

      res.status(500).json({ message: "Server error" });
    }
  }

  async mine(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const teams = await this.teamServices.getMyTeams(req.user.id);

      res.status(200).json({ success: true, data: teams });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async detail(req: Request, res: Response) {
    try {
      const team = await this.teamServices.getById(req.params.id as string);

      res.status(200).json({ success: true, data: team });
    } catch (error: any) {
      if (error instanceof HttpError)
        return res.status(error.status).json({ message: error.message });

      res.status(500).json({ message: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const updated = await this.teamServices.update(
        req.params.id as string,
        req.user.id,
        { name: req.body.name }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error(error);

      if (error instanceof HttpError)
        return res.status(error.status).json({ message: error.message });

      res.status(500).json({ message: "Server error" });
    }
  }

  async addMember(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      const result = await this.teamServices.addMember(
        req.params.id as string,
        req.user.id,
        req.body.profileId
      );

      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);

      if (error instanceof HttpError)
        return res.status(error.status).json({ message: error.message });

      res.status(500).json({ message: "Server error" });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      if (!req.user) throw new HttpError("Unauthorized", 401);

      await this.teamServices.removeMember(
        req.params.id as string,
        req.user.id,
        req.body.profileId
      );

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error(error);

      if (error instanceof HttpError)
        return res.status(error.status).json({ message: error.message });

      res.status(500).json({ message: "Server error" });
    }
  }
}
