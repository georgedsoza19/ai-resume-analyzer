import { cn, scoreTone } from "@/lib/utils";

export function ScoreRing({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const tone = scoreTone(score);
  const dim = size === "lg" ? 112 : size === "sm" ? 56 : 80;
  const stroke = size === "lg" ? 8 : 6;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-grid place-items-center",
        size === "lg" && "h-28 w-28",
        size === "md" && "h-20 w-20",
        size === "sm" && "h-14 w-14"
      )}
    >
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={
            tone === "high" ? "#0f766e" : tone === "mid" ? "#b45309" : "#b91c1c"
          }
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <div
          className={cn(
            "font-semibold tabular-nums text-[var(--ink)]",
            size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg"
          )}
        >
          {score}
        </div>
        {size !== "sm" ? <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">match</div> : null}
      </div>
    </div>
  );
}
