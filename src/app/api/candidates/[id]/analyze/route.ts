import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runAnalysisForCandidate } from "@/lib/evaluation";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  try {
    const evaluation = await runAnalysisForCandidate(candidate, candidate.job);
    return NextResponse.json({ evaluation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
