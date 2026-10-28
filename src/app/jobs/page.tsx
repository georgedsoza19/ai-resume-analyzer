import Link from "next/link";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { candidates: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">Jobs</h1>
          <p className="mt-2 text-[var(--muted)]">Manage roles and their requirement profiles.</p>
        </div>
        <Link href="/jobs/new">
          <Button>Create job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Start by defining a role with a clear description and must-have requirements."
          action={
            <Link href="/jobs/new">
              <Button>Create job</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="h-full transition hover:border-teal-300">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-sm text-[var(--muted)]">{job.company}</p>
                  </div>
                  {job.isSample ? <Badge tone="info">sample</Badge> : null}
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-[var(--muted)]">{job.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{job._count.candidates} candidates</span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
