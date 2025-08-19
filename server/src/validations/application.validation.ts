import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    company: z.string().min(1),
    jobTitle: z.string().min(1),
    jobLink: z.string().url().optional().or(z.literal("")).optional(),
    location: z.string().optional(),
    status: z
      .enum(["Applied", "Interview", "Offer", "Rejected", "Other"])
      .optional(),
    appliedAt: z.coerce.date().optional(),
    followUpReminder: z.coerce.date().optional(),
    followUpDone: z.boolean().optional(),
    followUpDue: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    company: z.string().min(1).optional(),
    jobTitle: z.string().min(1).optional(),
    jobLink: z.string().url().optional().or(z.literal("")).optional(),
    location: z.string().optional(),
    status: z
      .enum(["Applied", "Interview", "Offer", "Rejected", "Other"])
      .optional(),
    appliedAt: z.coerce.date().optional(),
    followUpReminder: z.coerce.date().optional(),
    followUpDone: z.boolean().optional(),
    followUpDue: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
