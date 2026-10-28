"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import { Button, ErrorAlert, Input, Label } from "@/components/ui";

const STEPS = ["Uploading", "Extracting text", "Analyzing with AI", "Done"] as const;

export function UploadForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<-1 | 0 | 1 | 2 | 3>(-1);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choose a PDF or DOCX resume.");
      return;
    }
    if (!name.trim()) {
      setError("Candidate name is required.");
      return;
    }

    setBusy(true);
    setStep(0);
    const timer1 = setTimeout(() => setStep(1), 400);
    const timer2 = setTimeout(() => setStep(2), 1200);

    try {
      const form = new FormData();
      form.set("file", file);
      form.set("name", name.trim());
      form.set("email", email.trim());

      const res = await fetch(`/api/jobs/${jobId}/candidates`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStep(3);
      const candidateId = data.candidate?.id;
      if (candidateId) {
        setTimeout(() => {
          router.push(`/candidates/${candidateId}`);
          router.refresh();
        }, 500);
      }
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setStep(-1);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-[var(--line)] bg-white p-5">
      {error ? <ErrorAlert message={error} /> : null}
      <div>
        <Label htmlFor="name">Candidate name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={busy} />
      </div>
      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
      </div>
      <FileDropzone file={file} onFile={setFile} disabled={busy} />

      {step >= 0 ? (
        <ol className="space-y-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          {STEPS.map((label, index) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={
                  index < step
                    ? "text-emerald-700"
                    : index === step
                      ? "font-semibold text-[var(--accent-strong)]"
                      : "text-[var(--muted)]"
                }
              >
                {index < step ? "✓" : index === step ? "●" : "○"}
              </span>
              <span className={index === step ? "text-[var(--ink)]" : "text-[var(--muted)]"}>{label}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <Button type="submit" disabled={busy}>
        {busy ? "Processing…" : "Upload & analyze"}
      </Button>
    </form>
  );
}
