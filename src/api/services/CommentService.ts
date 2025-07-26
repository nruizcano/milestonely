import { GenericService } from './GenericService'

import type { Comment } from '../../models/Comment'

export class CommentService extends GenericService<Comment> {
    private static _instance: CommentService

    private constructor() {
        super('comments')
    }

    public static get instance(): CommentService {
        if (!this._instance) {
            this._instance = new CommentService()
        }
        return this._instance
    }

    public async getCommentsByTask(taskId: string): Promise<Comment[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('task_id', taskId)
        if (error) throw new Error(error.message)
        return data || []
    }
}
