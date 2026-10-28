import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateSelectList } from "@/components/CandidateSelectList";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      candidates: {
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!job) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
              {job.title}
            </h1>
            {job.isSample ? <Badge tone="info">sample</Badge> : null}
          </div>
          <p className="mt-1 text-[var(--muted)]">
            {job.company} · Created {formatDate(job.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/jobs/${job.id}/upload`}>
            <Button>Upload resume</Button>
          </Link>
          <Link href={`/jobs/${job.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <DeleteJobButton jobId={job.id} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-[family-name:var(--font-display)] text-xl">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
            {job.description}
          </p>
        </Card>
        <Card>
          <h2 className="font-[family-name:var(--font-display)] text-xl">Requirements</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
            {job.requirements}
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Candidates</h2>
          <Link href={`/jobs/${job.id}/upload`}>
            <Button variant="secondary">Add resume</Button>
          </Link>
        </div>
        {job.candidates.length === 0 ? (
          <EmptyState
            title="No resumes yet"
            description="Upload a PDF or DOCX to generate an evidence-based match evaluation for this role."
            action={
              <Link href={`/jobs/${job.id}/upload`}>
                <Button>Upload resume</Button>
              </Link>
            }
          />
        ) : (
          <CandidateSelectList
            items={job.candidates.map((c) => ({
              id: c.id,
              name: c.name,
              status: c.status,
              jobId: c.jobId,
              matchScore: c.evaluation?.matchScore ?? null,
            }))}
          />
        )}
      </section>
    </div>
  );
}
