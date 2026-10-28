import { Badge } from "@/components/ui";

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "analyzed"
      ? "success"
      : status === "processing"
        ? "info"
        : status === "failed"
          ? "danger"
          : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
