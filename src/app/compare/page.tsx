import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";
import { Card, EmptyState, ErrorAlert } from "@/components/ui";
import { prisma } from "@/lib/db";
import { parseChecklist, parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length < 2) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Compare candidates</h1>
        <EmptyState
          title="Select candidates to compare"
          description="From a job or candidates list, select 2–3 analyzed candidates for the same role, then click Compare."
          action={
            <Link href="/candidates" className="text-sm font-medium text-[var(--accent-strong)] hover:underline">
              Go to candidates
            </Link>
          }
        />
      </div>
    );
  }

  if (ids.length > 3) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Compare candidates</h1>
        <ErrorAlert message="Compare supports a maximum of 3 candidates." />
      </div>
    );
  }

  const candidates = await prisma.candidate.findMany({
    where: { id: { in: ids } },
    include: { job: true, evaluation: true },
  });

  if (candidates.length !== ids.length) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Compare candidates</h1>
        <ErrorAlert message="One or more candidates were not found." />
      </div>
    );
  }

  const jobIds = new Set(candidates.map((c) => c.jobId));
  if (jobIds.size > 1) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Compare candidates</h1>
        <ErrorAlert message="Compare only works for candidates applying to the same job." />
      </div>
    );
  }

  const notAnalyzed = candidates.filter((c) => !c.evaluation || c.status !== "analyzed");
  if (notAnalyzed.length) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Compare candidates</h1>
        <ErrorAlert message="All selected candidates must be analyzed before comparing." />
      </div>
    );
  }

  const ordered = ids.map((id) => candidates.find((c) => c.id === id)!);
  const job = ordered[0].job;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
          Compare candidates
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {job.title} at {job.company} — decision support only.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Signal</th>
              {ordered.map((c) => (
                <th key={c.id} className="px-4 py-3">
                  <Link href={`/candidates/${c.id}`} className="text-[var(--accent-strong)] hover:underline">
                    {c.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]">
              <td className="px-4 py-4 font-medium">Match score</td>
              {ordered.map((c) => (
                <td key={c.id} className="px-4 py-4">
                  <ScoreRing score={c.evaluation!.matchScore} size="sm" />
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="px-4 py-4 font-medium">Checklist</td>
              {ordered.map((c) => {
                const checklist = parseChecklist(c.evaluation!.requirementsChecklist);
                const found = checklist.filter((i) => i.status === "found").length;
                return (
                  <td key={c.id} className="px-4 py-4 text-[var(--muted)]">
                    {found}/{checklist.length} found
                  </td>
                );
              })}
            </tr>
            <tr className="border-b border-[var(--line)] align-top">
              <td className="px-4 py-4 font-medium">Top matched skills</td>
              {ordered.map((c) => (
                <td key={c.id} className="px-4 py-4">
                  <ul className="list-disc space-y-1 pl-4 text-[var(--muted)]">
                    {parseJsonArray(c.evaluation!.skillsMatched)
                      .slice(0, 4)
                      .map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--line)] align-top">
              <td className="px-4 py-4 font-medium">Missing skills</td>
              {ordered.map((c) => (
                <td key={c.id} className="px-4 py-4">
                  <ul className="list-disc space-y-1 pl-4 text-[var(--muted)]">
                    {parseJsonArray(c.evaluation!.skillsMissing)
                      .slice(0, 4)
                      .map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="align-top">
              <td className="px-4 py-4 font-medium">Key gaps</td>
              {ordered.map((c) => (
                <td key={c.id} className="px-4 py-4">
                  <ul className="list-disc space-y-1 pl-4 text-[var(--muted)]">
                    {parseJsonArray(c.evaluation!.gaps)
                      .slice(0, 3)
                      .map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ordered.map((c) => (
          <Card key={c.id}>
            <h2 className="font-semibold">{c.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{c.evaluation!.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
