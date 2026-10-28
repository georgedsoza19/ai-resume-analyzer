import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hasGeminiKey } from "@/lib/gemini";
import { serializeEvaluation } from "@/lib/evaluation";

export async function GET() {
  const [jobCount, candidateCount, analyzedCount, sampleJob, recentCandidates, jobs] =
    await Promise.all([
      prisma.job.count(),
      prisma.candidate.count(),
      prisma.candidate.count({ where: { status: "analyzed" } }),
      prisma.job.findFirst({ where: { isSample: true } }),
      prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { job: true, evaluation: true },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { candidates: true } } },
      }),
    ]);

  return NextResponse.json({
    stats: {
      jobs: jobCount,
      candidates: candidateCount,
      analyzed: analyzedCount,
    },
    hasApiKey: hasGeminiKey(),
    hasSampleData: Boolean(sampleJob),
    jobs,
    recent: recentCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      jobTitle: c.job.title,
      company: c.job.company,
      matchScore: c.evaluation?.matchScore ?? null,
      evaluation: c.evaluation ? serializeEvaluation(c.evaluation) : null,
      createdAt: c.createdAt,
    })),
  });
}
