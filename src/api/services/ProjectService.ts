import { GenericService } from './GenericService'

import type { Project, ProjectStatus } from '../../models/Project'

export class ProjectService extends GenericService<Project> {
    private static _instance: ProjectService

    private constructor() {
        super('projects')
    }

    public static get instance(): ProjectService {
        if (!this._instance) {
            this._instance = new ProjectService()
        }
        return this._instance
    }

    public async getProjectsByOwner(ownerId: string): Promise<Project[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('owner_id', ownerId)
        if (error) throw new Error(error.message)
        return data || []
    }

    public async getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('status', status)
        if (error) throw new Error(error.message)
        return data || []
    }
}
