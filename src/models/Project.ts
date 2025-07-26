import { ProjectElem } from "./ProjectElem";

export enum ProjectStatus {
    NotStarted = "Not started",
    OnHold = "On hold",
    Blocked = "Blocked",
    OnGoing = "On going",
    Finished = "Finished"
}

export class Project extends ProjectElem {
    owner_id: string;
    status: ProjectStatus;

    constructor(
        name: string,
        owner_id: string,
        start_date: Date | null,
        end_date: Date | null,
        description: string | null
    ) {
        super(name, start_date, end_date, description);
        this.owner_id = owner_id;
        this.status = 'NotStarted' as ProjectStatus;
    }
}
