export class Comment {
    id: string | undefined;
    created_at: Date;
    text: string;
    user_id: string;
    task_id: string;

    constructor(text: string, user_id: string, task_id: string) {
        this.created_at = new Date();
        this.text = text;
        this.user_id = user_id;
        this.task_id = task_id;
    }
}
