"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatSignificanceMeter } from "@/components/experiments/StatSignificanceMeter";
import type { Experiment } from "@/lib/types";

const statusToBadge: Record<string, "running" | "completed" | "paused"> = {
  running: "running",
  completed: "completed",
  paused: "paused",
  insufficient_data: "paused"
};

export function ExperimentCard({
  experiment,
  onAnalyze,
  onSimulate
}: {
  experiment: Experiment;
  onAnalyze?: (id: string) => void;
  onSimulate?: (id: string, numEvents: number) => void;
}) {
  const [events, setEvents] = useState(500);
  const significance = experiment.statistical_significance ?? 0;
  const splitEntries = useMemo(
    () => Object.entries(experiment.traffic_split ?? {}),
    [experiment.traffic_split]
  );

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Experiment</p>
          <p className="font-mono text-sm text-sand-800">{experiment.id.slice(0, 10)}...</p>
        </div>
        <Badge status={statusToBadge[experiment.status] ?? "paused"}>{experiment.status}</Badge>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Variants in Test</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {experiment.variant_ids.map((variantId) => (
            <span key={variantId} className="rounded-full bg-sand-100 px-2 py-1 font-mono text-xs text-sand-700">
              {variantId.slice(0, 8)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Traffic Split</p>
        {splitEntries.length ? (
          <div className="mt-2 space-y-2">
            {splitEntries.map(([variantId, pct]) => (
              <div key={variantId} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-sand-600">
                  <span className="font-mono">{variantId.slice(0, 8)}</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand-200">
                  <div className="h-full rounded-full bg-terracotta/80" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-sand-600">Equal split (auto).</p>
        )}
      </div>

      <StatSignificanceMeter value={significance} />

      {experiment.status === "completed" && experiment.winner_id && (
        <div className="rounded-lg border border-terracotta/30 bg-terracotta-light/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Winner</p>
          <p className="font-display text-lg text-sand-900">Variant {experiment.winner_id.slice(0, 8)}</p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs text-sand-600">
          Simulate Traffic: {events} events
          <input
            type="range"
            min={50}
            max={5000}
            value={events}
            onChange={(event) => setEvents(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>
        <div className="flex items-end gap-2">
          <Button variant="secondary" onClick={() => onSimulate?.(experiment.id, events)}>
            Run Simulation
          </Button>
          <Button variant="primary" onClick={() => onAnalyze?.(experiment.id)}>
            Analyze
          </Button>
        </div>
      </div>
    </Card>
  );
}
