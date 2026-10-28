import { prisma } from "./db";
import {
  SAMPLE_EVALUATION,
  SAMPLE_EVALUATION_B,
  SAMPLE_JOB,
  SAMPLE_RESUME,
  SAMPLE_RESUME_B,
} from "./demo-data";
import type { EvaluationPayload } from "./schemas";

async function createEvaluation(candidateId: string, payload: EvaluationPayload) {
  await prisma.evaluation.create({
    data: {
      candidateId,
      matchScore: payload.matchScore,
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

export async function seedSampleData() {
  const existingJob = await prisma.job.findFirst({ where: { isSample: true } });
  if (existingJob) {
    return { created: false, jobId: existingJob.id };
  }

  const job = await prisma.job.create({
    data: { ...SAMPLE_JOB, isSample: true },
  });

  const alex = await prisma.candidate.create({
    data: {
      name: "Alex Rivera",
      email: "alex.rivera@email.com",
      resumeFilename: "alex-rivera-sample.txt",
      resumeText: SAMPLE_RESUME,
      status: "analyzed",
      isSample: true,
      jobId: job.id,
    },
  });
  await createEvaluation(alex.id, SAMPLE_EVALUATION);

  const jordan = await prisma.candidate.create({
    data: {
      name: "Jordan Lee",
      email: "jordan.lee@email.com",
      resumeFilename: "jordan-lee-sample.txt",
      resumeText: SAMPLE_RESUME_B,
      status: "analyzed",
      isSample: true,
      jobId: job.id,
    },
  });
  await createEvaluation(jordan.id, SAMPLE_EVALUATION_B);

  return { created: true, jobId: job.id };
}

export async function resetSampleData() {
  await prisma.job.deleteMany({ where: { isSample: true } });
  return seedSampleData();
}
