export enum UserStatus {
  Available = "Available",
  NotAvailable = "Not available",
}

export class User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  job_title: string | null;
  status: UserStatus;

  constructor(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string | null,
    job_title: string | null,
    status: UserStatus | null
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.job_title = job_title;
    this.status = status ?? UserStatus.Available;
  }
}
