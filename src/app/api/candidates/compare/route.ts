import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeEvaluation } from "@/lib/evaluation";
import { parseChecklist, parseJsonArray } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length < 2 || ids.length > 3) {
    return NextResponse.json({ error: "Select 2 or 3 candidates to compare" }, { status: 400 });
  }

  const candidates = await prisma.candidate.findMany({
    where: { id: { in: ids } },
    include: { job: true, evaluation: true },
  });

  if (candidates.length !== ids.length) {
    return NextResponse.json({ error: "One or more candidates were not found" }, { status: 404 });
  }

  const jobIds = new Set(candidates.map((c) => c.jobId));
  if (jobIds.size > 1) {
    return NextResponse.json(
      { error: "Compare only works for candidates applying to the same job" },
      { status: 400 }
    );
  }

  const notAnalyzed = candidates.filter((c) => c.status !== "analyzed" || !c.evaluation);
  if (notAnalyzed.length) {
    return NextResponse.json(
      { error: "All selected candidates must be analyzed before comparing" },
      { status: 400 }
    );
  }

  const ordered = ids.map((id) => candidates.find((c) => c.id === id)!);

  return NextResponse.json({
    job: ordered[0].job,
    candidates: ordered.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      status: c.status,
      evaluation: c.evaluation ? serializeEvaluation(c.evaluation) : null,
      checklistFound: c.evaluation
        ? parseChecklist(c.evaluation.requirementsChecklist).filter((i) => i.status === "found")
            .length
        : 0,
      checklistTotal: c.evaluation
        ? parseChecklist(c.evaluation.requirementsChecklist).length
        : 0,
      topMatched: c.evaluation ? parseJsonArray(c.evaluation.skillsMatched).slice(0, 4) : [],
      topMissing: c.evaluation ? parseJsonArray(c.evaluation.skillsMissing).slice(0, 4) : [],
      topGaps: c.evaluation ? parseJsonArray(c.evaluation.gaps).slice(0, 3) : [],
    })),
  });
}
