import { prisma } from "@/lib/prisma";
import type { Event } from "../../generated/prisma/client";

export class EventsRepository {
  async createEvents(data: Event): Promise<Event> {
    return await prisma.event.create({ data });
  }

  async fetchEventById(id: string) {
    return await prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async fetchAllEvents(): Promise<Event[]> {
    return await prisma.event.findMany();
  }

  async updateEvent(id: string, data: Event): Promise<Event> {
    return await prisma.event.update({ where: { id }, data });
  }
}
