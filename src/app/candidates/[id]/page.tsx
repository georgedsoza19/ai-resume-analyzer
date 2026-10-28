import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteCandidateButton } from "@/components/DeleteCandidateButton";
import { ExportMenu } from "@/components/ExportMenu";
import { ReanalyzeButton } from "@/components/ReanalyzeButton";
import { RequirementsChecklist } from "@/components/RequirementsChecklist";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge, Card, Disclaimer } from "@/components/ui";
import { prisma } from "@/lib/db";
import { parseChecklist, parseJsonArray, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { job: true, evaluation: true },
  });
  if (!candidate) notFound();

  const evaluation = candidate.evaluation
    ? {
        ...candidate.evaluation,
        skillsMatched: parseJsonArray(candidate.evaluation.skillsMatched),
        skillsMissing: parseJsonArray(candidate.evaluation.skillsMissing),
        strengths: parseJsonArray(candidate.evaluation.strengths),
        gaps: parseJsonArray(candidate.evaluation.gaps),
        requirementsChecklist: parseChecklist(candidate.evaluation.requirementsChecklist),
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
              {candidate.name}
            </h1>
            {candidate.isSample ? <Badge tone="info">sample</Badge> : null}
            <StatusBadge status={candidate.status} />
          </div>
          <p className="mt-1 text-[var(--muted)]">
            <Link href={`/jobs/${candidate.jobId}`} className="text-[var(--accent-strong)] hover:underline">
              {candidate.job.title}
            </Link>{" "}
            at {candidate.job.company}
            {candidate.email ? ` · ${candidate.email}` : ""}
            {" · "}
            {formatDate(candidate.createdAt)}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Resume file: {candidate.resumeFilename}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {evaluation ? <ExportMenu candidateId={candidate.id} /> : null}
          <ReanalyzeButton candidateId={candidate.id} />
          <DeleteCandidateButton candidateId={candidate.id} />
        </div>
      </div>

      <Disclaimer />

      {candidate.status === "failed" && candidate.errorMessage ? (
        <Card className="border-red-200 bg-red-50">
          <h2 className="font-semibold text-red-900">Analysis failed</h2>
          <p className="mt-1 text-sm text-red-800">{candidate.errorMessage}</p>
        </Card>
      ) : null}

      {evaluation ? (
        <>
          <section className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <Card className="flex items-center justify-center">
              <ScoreRing score={evaluation.matchScore} size="lg" />
            </Card>
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Summary</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{evaluation.summary}</p>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Experience notes</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {evaluation.experienceNotes}
              </p>
            </Card>
            <Card>
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
                Requirements checklist
              </h2>
              <RequirementsChecklist items={evaluation.requirementsChecklist} />
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Skills matched</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {evaluation.skillsMatched.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Skills missing</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {evaluation.skillsMissing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Strengths</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {evaluation.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="font-[family-name:var(--font-display)] text-xl">Potential gaps</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {evaluation.gaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </section>
        </>
      ) : (
        <Card>
          <h2 className="font-[family-name:var(--font-display)] text-xl">No evaluation yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use re-run analysis once a Gemini API key is configured, or open the seeded demo candidate from
            the dashboard.
          </p>
        </Card>
      )}
    </div>
  );
}
