import { cn } from "@/lib/utils";

export function StatSignificanceMeter({
  value,
  threshold = 0.95
}: {
  value: number;
  threshold?: number;
}) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  const isSignificant = value >= threshold;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-sand-600">
        <span>{isSignificant ? "Statistically Significant" : `${(value * 100).toFixed(1)}% confidence`}</span>
        <span>Threshold {(threshold * 100).toFixed(0)}%</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className={cn(
            "h-full rounded-full transition",
            isSignificant ? "bg-terracotta shadow-[0_0_12px_rgba(200,96,42,0.35)]" : "bg-sand-300"
          )}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 border-l border-dashed border-terracotta"
          style={{ left: `${threshold * 100}%` }}
        />
      </div>
    </div>
  );
}
