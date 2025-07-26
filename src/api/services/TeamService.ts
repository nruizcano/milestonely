import { GenericService } from './GenericService'

import type { Team } from '../../models/Team'

export class TeamService extends GenericService<Team> {
    private static _instance: TeamService

    private constructor() {
        super('teams')
    }

    public static get instance(): TeamService {
        if (!this._instance) {
            this._instance = new TeamService()
        }
        return this._instance
    }

    public async getTeamsByProject(projectId: string): Promise<Team[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('project_id', projectId)
        if (error) throw new Error(error.message)
        return data || []
    }

    public async getTeamsByMember(memberId: string): Promise<Team[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .contains('members_ids', JSON.stringify([memberId]))
        if (error) throw new Error(error.message)
        return data || []
    }
}
