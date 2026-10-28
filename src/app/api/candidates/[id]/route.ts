import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeEvaluation } from "@/lib/evaluation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { job: true, evaluation: true },
  });
  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...candidate,
    evaluation: candidate.evaluation ? serializeEvaluation(candidate.evaluation) : null,
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.candidate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }
}
