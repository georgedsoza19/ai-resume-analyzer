import { notFound } from "next/navigation";
import { JobForm } from "@/components/JobForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">Edit job</h1>
        <p className="mt-2 text-[var(--muted)]">Update the role profile used for resume matching.</p>
      </div>
      <JobForm
        jobId={job.id}
        initial={{
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements,
        }}
      />
    </div>
  );
}
