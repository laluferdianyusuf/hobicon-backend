import { RegistrationRepo } from "@/repositories/registration.repo";
import { HttpError } from "@/utils/http.error";
import { RegistrationStatus } from "../../generated/prisma/client";
import { EventsRepository, ProfileRepo, TeamRepo } from "@/repositories";

export class RegistrationServices {
  private registrationRepo = new RegistrationRepo();
  private eventRepo = new EventsRepository();
  private profileRepo = new ProfileRepo();
  private teamRepo = new TeamRepo();

  async registerIndividual(userId: string, eventId: string, profileId: string) {
    const event = await this.eventRepo.fetchEventById(eventId);
    if (!event) throw new HttpError("Event not found", 404);

    if (event.category !== "INDIVIDUAL")
      throw new HttpError("This event requires team registration", 400);

    const profile = await this.profileRepo.findById(profileId);
    if (!profile) throw new HttpError("Profile not found", 404);

    if (profile.userId !== userId)
      throw new HttpError("You do not own this profile", 403);

    const exists = await this.registrationRepo.findByProfile(
      eventId,
      profileId
    );
    if (exists) throw new HttpError("Already registered", 400);

    return this.registrationRepo.create({
      event: { connect: { id: eventId } },
      profile: { connect: { id: profileId } },
      status: RegistrationStatus.REGISTERED,
    });
  }

  async registerTeam(userId: string, eventId: string, teamId: string) {
    const event = await this.eventRepo.fetchEventById(eventId);
    if (!event) throw new HttpError("Event not found", 404);

    if (event.category !== "TEAM")
      throw new HttpError("This event does not accept team registration", 400);

    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new HttpError("Team not found", 404);

    if (team.coachUserId !== userId)
      throw new HttpError("You are not the coach of this team", 403);

    const exists = await this.registrationRepo.findByTeam(eventId, teamId);
    if (exists) throw new HttpError("Team already registered", 400);

    return this.registrationRepo.create({
      event: { connect: { id: eventId } },
      team: { connect: { id: teamId } },
      status: RegistrationStatus.REGISTERED,
    });
  }

  async getEventRegistrations(eventId: string) {
    return this.registrationRepo.findByEvent(eventId);
  }

  async updateStatus(id: string, status: RegistrationStatus) {
    const reg = await this.registrationRepo.findById(id);
    if (!reg) throw new HttpError("Registration not found", 404);

    return this.registrationRepo.update(id, { status });
  }

  async delete(id: string, userId: string) {
    const reg = await this.registrationRepo.findById(id);
    if (!reg) throw new HttpError("Registration not found", 404);

    // if individual — check profile owner
    if (reg.profileId) {
      const profile = await this.profileRepo.findById(reg.profileId);

      if (!profile) throw new HttpError("Profile not found", 404);
      if (profile.userId !== userId) throw new HttpError("Forbidden", 403);
    }

    // if team — only coach can delete
    if (reg.teamId) {
      const team = await this.teamRepo.findById(reg.teamId);

      if (!team) throw new HttpError("Team not found", 404);
      if (team.coachUserId !== userId) throw new HttpError("Forbidden", 403);
    }

    return this.registrationRepo.delete(id);
  }
}
