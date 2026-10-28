import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  company: z.string().trim().min(1, "Company is required").max(120),
  description: z.string().trim().min(20, "Add a fuller job description (min 20 characters)"),
  requirements: z.string().trim().min(10, "Add role requirements (min 10 characters)"),
});

export const checklistItemSchema = z.object({
  requirement: z.string(),
  status: z.enum(["found", "partial", "missing"]),
  evidence: z.string(),
});

export const evaluationSchema = z.object({
  matchScore: z.number().min(0).max(100),
  summary: z.string(),
  skillsMatched: z.array(z.string()),
  skillsMissing: z.array(z.string()),
  experienceNotes: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  requirementsChecklist: z.array(checklistItemSchema),
});

export type JobInput = z.infer<typeof jobSchema>;
export type EvaluationPayload = z.infer<typeof evaluationSchema>;
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;
