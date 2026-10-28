import { Badge } from "@/components/ui";

type Item = {
  requirement: string;
  status: "found" | "partial" | "missing";
  evidence: string;
};

const toneMap = {
  found: "success",
  partial: "warn",
  missing: "danger",
} as const;

export function RequirementsChecklist({ items }: { items: Item[] }) {
  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">No checklist items available.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item.requirement}-${index}`}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-medium text-[var(--ink)]">{item.requirement}</p>
            <Badge tone={toneMap[item.status]}>{item.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{item.evidence}</p>
        </li>
      ))}
    </ul>
  );
}
