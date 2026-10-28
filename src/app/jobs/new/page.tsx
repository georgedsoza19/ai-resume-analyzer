import { JobForm } from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">Create job</h1>
        <p className="mt-2 text-[var(--muted)]">
          Write a clear description and requirements — evaluations are grounded only in this text and each
          resume.
        </p>
      </div>
      <JobForm />
    </div>
  );
}
