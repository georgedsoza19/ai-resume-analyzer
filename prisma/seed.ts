import { PrismaClient } from "@prisma/client";
import {
  SAMPLE_EVALUATION,
  SAMPLE_EVALUATION_B,
  SAMPLE_JOB,
  SAMPLE_RESUME,
  SAMPLE_RESUME_B,
} from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function createEvaluation(
  candidateId: string,
  payload: typeof SAMPLE_EVALUATION
) {
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

async function main() {
  const existing = await prisma.job.findFirst({ where: { isSample: true } });
  if (existing) {
    console.log("Sample data already present.");
    return;
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

  console.log("Seeded sample job and two candidates for compare/demo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
