import type { Request, Response } from "express";
import { ResultServices } from "@/services/result.services";
import { HttpError } from "@/utils/http.error";

export class ResultController {
  private services = new ResultServices();

  async createResult(req: Request, res: Response) {
    const { registrationId } = req.params;

    if (!registrationId) {
      return res.status(404).json({
        success: false,
        message: "No registration id",
      });
    }

    const result = await this.services.createResult({
      registrationId,
      eventId: req.body.eventId,

      score: req.body.score ? Number(req.body.score) : null,
      rank: req.body.rank ? Number(req.body.rank) : null,
      passed:
        req.body.passed === undefined ? null : JSON.parse(req.body.passed),
      judgeNotes: req.body.judgeNotes ?? null,

      file: req.file ?? null,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await this.services.update(req.params.id as string, {
        score: req.body.score ?? null,
        rank: req.body.rank ?? null,
        passed: req.body.passed ?? null,
        judgeNotes: req.body.judgeNotes ?? null,
      });

      res.status(200).json({ success: true, data: updated });
    } catch (e: any) {
      if (e instanceof HttpError)
        return res
          .status(e.status)
          .json({ success: false, message: e.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.services.delete(req.params.id as string);
      res.status(200).json({ success: true });
    } catch (e: any) {
      if (e instanceof HttpError)
        return res
          .status(e.status)
          .json({ success: false, message: e.message });

      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}
