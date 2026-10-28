"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ErrorAlert } from "@/components/ui";

export function ReanalyzeButton({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/candidates/${candidateId}/analyze`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 print:hidden">
      {error ? <ErrorAlert message={error} /> : null}
      <Button variant="secondary" disabled={busy} onClick={onClick}>
        {busy ? "Analyzing…" : "Re-run analysis"}
      </Button>
    </div>
  );
}
