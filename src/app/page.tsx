import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { prisma } from "@/lib/db";
import { hasGeminiKey } from "@/lib/gemini";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [jobCount, candidateCount, analyzedCount, sampleJob, jobs, recent] = await Promise.all([
    prisma.job.count(),
    prisma.candidate.count(),
    prisma.candidate.count({ where: { status: "analyzed" } }),
    prisma.job.findFirst({ where: { isSample: true } }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { _count: { select: { candidates: true } } },
    }),
    prisma.candidate.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { job: true, evaluation: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">Hiring workspace</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
            Matchline
          </h1>
          <p className="mt-3 max-w-xl text-base text-[var(--muted)]">
            Create roles, upload resumes, and review evidence-based match scores. Assessments use only the
            resume and job description — never invented details.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/jobs/new">
              <Button>Create job</Button>
            </Link>
            <Link href="/candidates">
              <Button variant="secondary">Browse candidates</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Jobs", value: jobCount },
            { label: "Candidates", value: candidateCount },
            { label: "Analyzed", value: analyzedCount },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      <DemoBanner hasSampleData={Boolean(sampleJob)} hasApiKey={hasGeminiKey()} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">Jobs</h2>
            <Link href="/jobs" className="text-sm text-[var(--accent-strong)] hover:underline">
              View all
            </Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState
              title="No jobs yet"
              description="Create a role to start comparing resumes against clear requirements."
              action={
                <Link href="/jobs/new">
                  <Button>Create job</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="transition hover:border-teal-300">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-[var(--ink)]">{job.title}</h3>
                        <p className="text-sm text-[var(--muted)]">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.isSample ? <Badge tone="info">sample</Badge> : null}
                        <Badge>{job._count.candidates} candidates</Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">Recent candidates</h2>
            <Link href="/candidates" className="text-sm text-[var(--accent-strong)] hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="No candidates yet"
              description="Upload a resume against a job to generate a match evaluation."
            />
          ) : (
            <div className="space-y-3">
              {recent.map((candidate) => (
                <Link key={candidate.id} href={`/candidates/${candidate.id}`}>
                  <Card className="transition hover:border-teal-300">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-[var(--ink)]">{candidate.name}</h3>
                        <p className="text-sm text-[var(--muted)]">
                          {candidate.job.title} · {formatDate(candidate.createdAt)}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={candidate.status} />
                        </div>
                      </div>
                      {candidate.evaluation ? (
                        <ScoreRing score={candidate.evaluation.matchScore} size="sm" />
                      ) : null}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
