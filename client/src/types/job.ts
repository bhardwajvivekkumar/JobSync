export interface JobApplication {
  _id?: string;
  userId: string;
  company: string;
  jobTitle: string;
  jobLink?: string;
  location?: string;
  status: "applied" | "interviewing" | "rejected" | "offer";
  appliedAt?: string;
  followUpReminder?: string;
  followUpDone?: boolean;
  tags: string;
}
