"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function DeleteCandidateButton({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this candidate and evaluation?")) return;
    setBusy(true);
    const res = await fetch(`/api/candidates/${candidateId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.push("/candidates");
      router.refresh();
    }
  }

  return (
    <Button variant="danger" disabled={busy} onClick={onDelete} className="print:hidden">
      Delete
    </Button>
  );
}
