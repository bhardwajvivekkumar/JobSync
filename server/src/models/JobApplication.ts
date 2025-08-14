import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  userId: string;
  company: string;
  jobTitle: string;
  jobLink: string;
  location: string;
  status: string;
  appliedAt: Date;
  followUpReminder: Date;
  followUpDone: boolean;
  followUpDue?: boolean;
  tags: string[];
}

const JobApplicationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobLink: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected", "Other"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
  followUpReminder: { type: Date },
  followUpDone: { type: Boolean, default: false },
  followUpDue: { type: Boolean, default: false },
  tags: [{ type: String }],
});

export default mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
