"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this job and all linked candidates?")) return;
    setBusy(true);
    const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.push("/jobs");
      router.refresh();
    }
  }

  return (
    <Button variant="danger" disabled={busy} onClick={onDelete}>
      {busy ? "Deleting…" : "Delete"}
    </Button>
  );
}
