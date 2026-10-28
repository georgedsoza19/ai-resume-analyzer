import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeEvaluation } from "@/lib/evaluation";
import { buildMarkdownReport } from "@/lib/export";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "md";

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { job: true, evaluation: true },
  });

  if (!candidate?.evaluation) {
    return NextResponse.json({ error: "Analyzed candidate required for export" }, { status: 404 });
  }

  if (format !== "md") {
    return NextResponse.json({ error: "Only format=md is supported" }, { status: 400 });
  }

  const markdown = buildMarkdownReport({
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    jobTitle: candidate.job.title,
    company: candidate.job.company,
    evaluation: serializeEvaluation(candidate.evaluation),
  });

  const filename = `${candidate.name.replace(/\s+/g, "-").toLowerCase()}-evaluation.md`;
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
