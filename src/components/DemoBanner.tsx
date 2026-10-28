"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function DemoBanner({
  hasSampleData,
  hasApiKey,
}: {
  hasSampleData: boolean;
  hasApiKey: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(path: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo action failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Demo mode</p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Explore with sample hiring data
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
            {hasApiKey
              ? "A free Gemini key is configured. You can analyze real uploads anytime."
              : "No Gemini API key yet — browse the seeded Frontend Engineer sample, or add a free key from Google AI Studio for live analysis."}
          </p>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {!hasSampleData ? (
            <Button disabled={busy} onClick={() => run("/api/demo/seed")}>
              Load sample data
            </Button>
          ) : (
            <Button variant="secondary" disabled={busy} onClick={() => run("/api/demo/reset")}>
              Reset sample data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
