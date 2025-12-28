import { EventsRepository } from "@/repositories";
import type { Event, Prisma } from "../../generated/prisma/client";

export class EventServices {
  private eventRepository: EventsRepository;

  constructor() {
    this.eventRepository = new EventsRepository();
  }

  async createEvent(data: Prisma.EventCreateInput) {
    try {
      return await this.eventRepository.createEvents(data as Event);
    } catch (error) {
      console.error("Create event failed:", error);
      throw error;
    }
  }

  async fetchEventById(id: string) {
    try {
      return await this.eventRepository.fetchEventById(id);
    } catch (error) {
      console.error("Fetch failed");
      throw error;
    }
  }

  async fetchALlEvents() {
    try {
      return await this.eventRepository.fetchAllEvents();
    } catch (error) {
      console.error("Fetch failed");
      throw error;
    }
  }
}
