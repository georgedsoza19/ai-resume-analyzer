"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, ErrorAlert, Input, Label, Textarea } from "@/components/ui";

type JobValues = {
  title: string;
  company: string;
  description: string;
  requirements: string;
};

export function JobForm({
  initial,
  jobId,
}: {
  initial?: JobValues;
  jobId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<JobValues>(
    initial ?? { title: "", company: "", description: "", requirements: "" }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(jobId ? `/api/jobs/${jobId}` : "/api/jobs", {
        method: jobId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save job");
      router.push(`/jobs/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-[var(--line)] bg-white p-5">
      {error ? <ErrorAlert message={error} /> : null}
      <div>
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="Frontend Engineer"
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          required
          value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
          placeholder="Northline Labs"
        />
      </div>
      <div>
        <Label htmlFor="description">Job description</Label>
        <Textarea
          id="description"
          required
          rows={6}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="Describe the role, team, and responsibilities…"
        />
      </div>
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          required
          rows={5}
          value={values.requirements}
          onChange={(e) => setValues((v) => ({ ...v, requirements: e.target.value }))}
          placeholder="List must-have skills and experience…"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : jobId ? "Save changes" : "Create job"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
