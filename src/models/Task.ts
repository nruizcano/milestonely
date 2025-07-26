import { ProjectElem } from "./ProjectElem";

export enum TaskPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low"
}

export enum TaskStatus {
  ToDo = "To-do",
  OnHold = "On hold",
  Blocked = "Blocked",
  InProgress = "In progress",
  Done = "Done"
}

export class Task extends ProjectElem {
  project_id: string;
  assignees_ids: string[];
  priority: TaskPriority | null;
  status: TaskStatus;

  constructor(
    name: string,
    project_id: string,
    start_date: Date | null,
    end_date: Date | null,
    description: string | null,
    assignees_ids: string[],
    priority: TaskPriority | null,
  ) {
    super(name, start_date, end_date, description);
    this.project_id = project_id;
    this.assignees_ids = assignees_ids;
    this.priority = priority;
    this.status = 'ToDo' as TaskStatus;
  }
}
