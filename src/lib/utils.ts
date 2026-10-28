import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseChecklist(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      requirement: String(item?.requirement ?? ""),
      status: (["found", "partial", "missing"].includes(item?.status)
        ? item.status
        : "missing") as "found" | "partial" | "missing",
      evidence: String(item?.evidence ?? "insufficient evidence"),
    }));
  } catch {
    return [];
  }
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function scoreTone(score: number) {
  if (score >= 75) return "high" as const;
  if (score >= 50) return "mid" as const;
  return "low" as const;
}
