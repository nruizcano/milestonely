export class Team {
    id: string | undefined;
    name: string;
    project_id: string;
    members_ids: string[];

    constructor(name: string, project_id: string, members_ids: string[]) {
        this.name = name;
        this.project_id = project_id;
        this.members_ids = members_ids;
    }
}
