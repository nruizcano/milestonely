import { GenericService } from './GenericService'

import type { Task, TaskStatus } from '../../models/Task'

import { getStartOfCurrentWeek, getEndOfCurrentWeek } from '../../utils/dates'

export class TaskService extends GenericService<Task> {
    private static _instance: TaskService

    private constructor() {
        super('tasks')
    }

    public static get instance(): TaskService {
        if (!this._instance) {
            this._instance = new TaskService()
        }
        return this._instance
    }

    public async getTasksByProject(projectId: string): Promise<Task[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('project_id', projectId)
            .order('start_date', { ascending: true })
            .order('end_date', { ascending: true })
        if (error) throw new Error(error.message)
        return data || []
    }

    public async getTasksByProjectAndStatus(projectId: string, status: TaskStatus): Promise<Task[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('project_id', projectId)
            .eq('status', status)
            .order('start_date', { ascending: true })
            .order('end_date', { ascending: true })
        if (error) throw new Error(error.message)
        return data || []
    }

    public async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .contains('assignees_ids', JSON.stringify([assigneeId]))
            .order('start_date', { ascending: true })
            .order('end_date', { ascending: true })
        if (error) throw new Error(error.message)
        return data || []
    }

    public async getTasksByAssigneeAndWithDueDateThisWeek(assigneeId: string): Promise<Task[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .contains('assignees_ids', JSON.stringify([assigneeId]))
            .filter('end_date', 'gte', getStartOfCurrentWeek())
            .filter('end_date', 'lte', getEndOfCurrentWeek())
            .order('start_date', { ascending: true })
            .order('end_date', { ascending: true })
        if (error) throw new Error(error.message)
        return data || []
    }
}
