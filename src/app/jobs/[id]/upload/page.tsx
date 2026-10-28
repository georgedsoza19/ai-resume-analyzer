import Link from "next/link";
import { notFound } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";
import { Disclaimer } from "@/components/ui";
import { prisma } from "@/lib/db";
import { hasGeminiKey } from "@/lib/gemini";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function UploadPage({ params }: Props) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-[var(--muted)]">
          <Link href={`/jobs/${job.id}`} className="text-[var(--accent-strong)] hover:underline">
            {job.title}
          </Link>{" "}
          at {job.company}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
          Upload resume
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          PDF or DOCX only. Text is extracted locally, then scored against this job’s description.
        </p>
      </div>
      {!hasGeminiKey() ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          No Gemini API key configured. The file can still be saved, but live AI analysis requires a free key
          in <code className="font-mono">GOOGLE_GENERATIVE_AI_API_KEY</code>. Demo data remains available
          without a key.
        </div>
      ) : null}
      <Disclaimer />
      <UploadForm jobId={job.id} />
    </div>
  );
}
