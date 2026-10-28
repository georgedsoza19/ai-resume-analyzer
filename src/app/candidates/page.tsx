import Link from "next/link";
import { CandidateSelectList } from "@/components/CandidateSelectList";
import { Button, EmptyState, Select } from "@/components/ui";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ jobId?: string; status?: string }> };

export default async function CandidatesPage({ searchParams }: Props) {
  const { jobId, status } = await searchParams;
  const [jobs, candidates] = await Promise.all([
    prisma.job.findMany({ orderBy: { title: "asc" } }),
    prisma.candidate.findMany({
      where: {
        ...(jobId ? { jobId } : {}),
        ...(status ? { status } : {}),
      },
      include: { job: true, evaluation: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">Candidates</h1>
          <p className="mt-2 text-[var(--muted)]">Filter, open evaluations, or compare analyzed resumes.</p>
        </div>
        <Link href="/jobs">
          <Button variant="secondary">Pick a job to upload</Button>
        </Link>
      </div>

      <form className="grid gap-3 rounded-xl border border-[var(--line)] bg-white p-4 sm:grid-cols-3">
        <Select name="jobId" defaultValue={jobId || ""}>
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} · {job.company}
            </option>
          ))}
        </Select>
        <Select name="status" defaultValue={status || ""}>
          <option value="">All statuses</option>
          <option value="analyzed">Analyzed</option>
          <option value="processing">Processing</option>
          <option value="uploaded">Uploaded</option>
          <option value="failed">Failed</option>
        </Select>
        <Button type="submit">Apply filters</Button>
      </form>

      {candidates.length === 0 ? (
        <EmptyState
          title="No candidates match"
          description="Upload resumes from a job page, or load sample demo data from the dashboard."
        />
      ) : (
        <CandidateSelectList
          items={candidates.map((c) => ({
            id: c.id,
            name: `${c.name} · ${c.job.title}`,
            status: c.status,
            jobId: c.jobId,
            matchScore: c.evaluation?.matchScore ?? null,
          }))}
        />
      )}
    </div>
  );
}
