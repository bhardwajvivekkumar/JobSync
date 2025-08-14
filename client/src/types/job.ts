export interface JobApplication {
  _id?: string;
  userId?: string;
  company: string;
  jobTitle: string;
  jobLink?: string;
  location?: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected" | "Other";
  appliedAt?: string;
  followUpReminder?: string;
  followUpDone?: boolean;
  followUpDue?: boolean;
  tags: string;
}
