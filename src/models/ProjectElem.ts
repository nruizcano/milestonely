export class ProjectElem {
  id: string | undefined;
  created_at: Date;
  start_date: Date | null;
  end_date: Date | null;
  name: string;
  description: string | null;

  constructor(
    name: string,
    start_date: Date | null,
    end_date: Date | null,
    description: string | null
  ) {
    this.created_at = new Date();
    this.start_date = start_date;
    this.end_date = end_date;
    this.name = name;
    this.description = description;
  }
}
