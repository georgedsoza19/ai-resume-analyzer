"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, ErrorAlert } from "@/components/ui";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  name: string;
  status: string;
  jobId: string;
  matchScore: number | null;
};

export function CandidateSelectList({
  items,
  showCompare = true,
}: {
  items: Item[];
  showCompare?: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

  const analyzedSelected = useMemo(
    () => selected.filter((id) => items.find((i) => i.id === id)?.status === "analyzed"),
    [selected, items]
  );

  function toggle(id: string) {
    setError("");
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  function compare() {
    if (analyzedSelected.length < 2) {
      setError("Select 2–3 analyzed candidates for the same job.");
      return;
    }
    const jobIds = new Set(
      analyzedSelected.map((id) => items.find((i) => i.id === id)?.jobId).filter(Boolean)
    );
    if (jobIds.size > 1) {
      setError("Compare only works across candidates for the same job.");
      return;
    }
    router.push(`/compare?ids=${analyzedSelected.join(",")}`);
  }

  return (
    <div className="space-y-3">
      {showCompare ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-[var(--muted)]">
            Select 2–3 analyzed candidates to compare ({analyzedSelected.length} selected)
          </p>
          <Button type="button" variant="secondary" onClick={compare} disabled={analyzedSelected.length < 2}>
            Compare selected
          </Button>
        </div>
      ) : null}
      {error ? <ErrorAlert message={error} /> : null}
      {items.map((item) => (
        <Card key={item.id} className="flex items-center gap-4">
          {showCompare ? (
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--accent)]"
              checked={selected.includes(item.id)}
              onChange={() => toggle(item.id)}
              aria-label={`Select ${item.name}`}
            />
          ) : null}
          <Link href={`/candidates/${item.id}`} className="flex flex-1 items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[var(--ink)]">{item.name}</h3>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
            {item.matchScore != null ? <ScoreRing score={item.matchScore} size="sm" /> : null}
          </Link>
        </Card>
      ))}
    </div>
  );
}
