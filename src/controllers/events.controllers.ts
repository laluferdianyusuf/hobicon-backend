import { EventServices } from "@/services";
import { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";

export class EventController {
  private eventServices: EventServices;

  constructor() {
    this.eventServices = new EventServices();
  }

  async createEvent(req: Request, res: Response) {
    try {
      const data: Prisma.EventCreateInput = req.body;
      const event = await this.eventServices.createEvent(data);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      console.error("Create Event Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await this.eventServices.fetchEventById(id as string);
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }
      res.status(200).json({ success: true, data: event });
    } catch (error) {
      console.error("Fetch Event Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await this.eventServices.fetchALlEvents();
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error("Fetch Events Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
