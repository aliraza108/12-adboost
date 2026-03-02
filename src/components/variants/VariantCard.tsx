import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Variant } from "@/lib/types";

export function VariantCard({ variant }: { variant: Variant }) {
  const predictedCtr = variant.predictions?.predicted_ctr ?? 0;
  const predictedCvr = variant.predictions?.predicted_cvr ?? 0;
  const engagement = variant.predictions?.engagement_score ?? 0;
  const hasActualCtr = typeof variant.ctr === "number";
  const delta = hasActualCtr ? (variant.ctr as number) - predictedCtr : null;

  return (
    <Card
      className={`relative p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,58,30,0.12)] ${
        variant.status === "winner" ? "border border-terracotta/60 shadow-[0_0_24px_rgba(200,96,42,0.25)]" : ""
      }`}
    >
      {variant.status === "winner" && (
        <span className="absolute right-4 top-4 rounded-full bg-terracotta px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
          Winner
        </span>
      )}
      <h3 className="font-display text-xl text-sand-900">{variant.creative.headline}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-sand-600">{variant.creative.body ?? "No body copy"}</p>
      <div className="mt-4">
        <span className="inline-flex rounded-lg bg-terracotta px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
          {variant.creative.cta}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {variant.creative.tone && <Badge status="testing">{variant.creative.tone}</Badge>}
        {variant.creative.emotional_trigger && <Badge status="testing">{variant.creative.emotional_trigger}</Badge>}
        <Badge
          status={
            variant.status === "winner"
              ? "winner"
              : variant.status === "draft"
                ? "draft"
                : variant.status === "loser"
                  ? "loser"
                  : "testing"
          }
        >
          {variant.status}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-sand-600">
        <div>
          <p className="uppercase tracking-[0.2em]">CTR</p>
          <p className="font-mono text-sand-900">{predictedCtr.toFixed(4)}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">CVR</p>
          <p className="font-mono text-sand-900">{predictedCvr.toFixed(4)}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">Score</p>
          <p className="font-mono text-sand-900">{engagement.toFixed(1)}</p>
        </div>
      </div>

      {hasActualCtr && delta !== null && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-sand-100 p-2 text-xs text-sand-700">
          <span>Actual CTR {(variant.ctr as number).toFixed(4)}</span>
          <span className={`inline-flex items-center gap-1 ${delta >= 0 ? "text-sage" : "text-terracotta"}`}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta * 100).toFixed(2)} pts vs predicted
          </span>
        </div>
      )}
    </Card>
  );
}
