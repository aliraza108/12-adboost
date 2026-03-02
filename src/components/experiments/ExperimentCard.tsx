"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatSignificanceMeter } from "@/components/experiments/StatSignificanceMeter";
import type { Experiment } from "@/lib/types";

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

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Experiment</p>
          <p className="font-mono text-sm text-sand-800">{experiment.id.slice(0, 8)}...</p>
        </div>
        <Badge status={experiment.status === "completed" ? "completed" : "running"}>
          {experiment.status}
        </Badge>
      </div>
      <div className="text-xs text-sand-600">
        Variants in test: {experiment.variant_ids.length}
      </div>
      <StatSignificanceMeter value={significance} />
      {experiment.status === "completed" && experiment.winner_id && (
        <div className="rounded-lg bg-sand-100 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Winner</p>
          <p className="font-display text-lg text-sand-900">Variant {experiment.winner_id.slice(0, 6)}</p>
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
