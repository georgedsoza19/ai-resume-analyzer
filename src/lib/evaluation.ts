import type { Evaluation, Candidate, Job } from "@prisma/client";
import { prisma } from "./db";
import { analyzeResumeAgainstJob, hasGeminiKey } from "./gemini";
import type { EvaluationPayload } from "./schemas";
import { parseChecklist, parseJsonArray } from "./utils";

export type SerializedEvaluation = {
  id: string;
  matchScore: number;
  summary: string;
  skillsMatched: string[];
  skillsMissing: string[];
  experienceNotes: string;
  strengths: string[];
  gaps: string[];
  requirementsChecklist: ReturnType<typeof parseChecklist>;
  createdAt: string;
};

export function serializeEvaluation(evaluation: Evaluation): SerializedEvaluation {
  return {
    id: evaluation.id,
    matchScore: evaluation.matchScore,
    summary: evaluation.summary,
    skillsMatched: parseJsonArray(evaluation.skillsMatched),
    skillsMissing: parseJsonArray(evaluation.skillsMissing),
    experienceNotes: evaluation.experienceNotes,
    strengths: parseJsonArray(evaluation.strengths),
    gaps: parseJsonArray(evaluation.gaps),
    requirementsChecklist: parseChecklist(evaluation.requirementsChecklist),
    createdAt: evaluation.createdAt.toISOString(),
  };
}

export async function persistEvaluation(candidateId: string, payload: EvaluationPayload) {
  return prisma.evaluation.upsert({
    where: { candidateId },
    create: {
      candidateId,
      matchScore: Math.round(payload.matchScore),
      summary: payload.summary,
      skillsMatched: JSON.stringify(payload.skillsMatched),
      skillsMissing: JSON.stringify(payload.skillsMissing),
      experienceNotes: payload.experienceNotes,
      strengths: JSON.stringify(payload.strengths),
      gaps: JSON.stringify(payload.gaps),
      requirementsChecklist: JSON.stringify(payload.requirementsChecklist),
      rawJson: JSON.stringify(payload),
    },
    update: {
      matchScore: Math.round(payload.matchScore),
      summary: payload.summary,
      skillsMatched: JSON.stringify(payload.skillsMatched),
      skillsMissing: JSON.stringify(payload.skillsMissing),
      experienceNotes: payload.experienceNotes,
      strengths: JSON.stringify(payload.strengths),
      gaps: JSON.stringify(payload.gaps),
      requirementsChecklist: JSON.stringify(payload.requirementsChecklist),
      rawJson: JSON.stringify(payload),
    },
  });
}

export async function runAnalysisForCandidate(
  candidate: Candidate,
  job: Job
): Promise<SerializedEvaluation> {
  if (!hasGeminiKey()) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY. Browse demo data or add a free Gemini key to analyze uploads."
    );
  }

  await prisma.candidate.update({
    where: { id: candidate.id },
    data: { status: "processing", errorMessage: null },
  });

  try {
    const payload = await analyzeResumeAgainstJob({
      jobTitle: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      resumeText: candidate.resumeText,
    });
    const evaluation = await persistEvaluation(candidate.id, payload);
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: "analyzed", errorMessage: null },
    });
    return serializeEvaluation(evaluation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: "failed", errorMessage: message },
    });
    throw error;
  }
}
