"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CampaignResponse } from "@/lib/types";

export function OptimizationPanel({
  campaigns,
  onRunLoop,
  onAutoExperiment,
  loading
}: {
  campaigns: CampaignResponse[];
  onRunLoop: (campaignId: string, iterations: number) => void;
  onAutoExperiment: (campaignId: string, numVariants: number) => void;
  loading?: boolean;
}) {
  const [campaignId, setCampaignId] = useState<string>(campaigns[0]?.id ?? "");
  const [iterations, setIterations] = useState(3);
  const [mode, setMode] = useState<"loop" | "auto">("loop");

  return (
    <Card className="space-y-5 p-6">
      <h3 className="font-display text-xl">Optimization Control</h3>
      <label className="text-sm text-sand-700">
        Campaign
        <select
          value={campaignId}
          onChange={(event) => setCampaignId(event.target.value)}
          className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
        >
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-sand-700">
        Optimization Loops: {iterations}
        <input
          type="range"
          min={1}
          max={5}
          value={iterations}
          onChange={(event) => setIterations(Number(event.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <div className="flex gap-2">
        <Button type="button" variant={mode === "loop" ? "primary" : "secondary"} onClick={() => setMode("loop")}
        >
          Optimize Loop
        </Button>
        <Button type="button" variant={mode === "auto" ? "primary" : "secondary"} onClick={() => setMode("auto")}
        >
          Auto Experiment
        </Button>
      </div>
      <Button
        type="button"
        variant="primary"
        className="w-full font-display"
        loading={loading}
        onClick={() =>
          mode === "loop" ? onRunLoop(campaignId, iterations) : onAutoExperiment(campaignId, 3)
        }
      >
        Run Optimization
      </Button>
    </Card>
  );
}
