import { TeamRepo } from "@/repositories/team.repo";
import { TeamMemberRepo } from "@/repositories/teamMember.repo";
import { HttpError } from "@/utils/http.error";
import type { Team } from "../../generated/prisma/client";

type TeamCreateInput = Omit<Team, "id" | "createdAt">;

export class TeamServices {
  private teamRepo = new TeamRepo();
  private memberRepo = new TeamMemberRepo();

  async create(userId: string, data: TeamCreateInput) {
    if (!data.eventId) throw new HttpError("eventId required", 400);

    return this.teamRepo.create({
      name: data.name,
      event: { connect: { id: data.eventId } },
      coach: { connect: { id: userId } },
    });
  }

  async getById(id: string) {
    const team = await this.teamRepo.findById(id);

    if (!team) throw new HttpError("Team not found", 404);

    return team;
  }

  async getMyTeams(userId: string) {
    return this.teamRepo.findByCoach(userId);
  }

  async update(id: string, userId: string, data: { name?: string }) {
    const existing = await this.getById(id);

    if (existing.coachUserId !== userId) throw new HttpError("Forbidden", 403);

    return this.teamRepo.update(id, {
      ...(data.name !== undefined && { name: data.name }),
    });
  }

  async addMember(teamId: string, coachId: string, profileId: string) {
    const team = await this.getById(teamId);

    if (team.coachUserId !== coachId) throw new HttpError("Forbidden", 403);

    const exists = await this.memberRepo.exists(teamId, profileId);
    if (exists) throw new HttpError("Member already added", 409);

    return this.memberRepo.add(teamId, profileId);
  }

  async removeMember(teamId: string, coachId: string, profileId: string) {
    const team = await this.getById(teamId);

    if (team.coachUserId !== coachId) throw new HttpError("Forbidden", 403);

    return this.memberRepo.remove(teamId, profileId);
  }
}
