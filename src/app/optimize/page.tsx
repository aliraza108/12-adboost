"use client";

import { useEffect, useState } from "react";
import { listCampaigns } from "@/lib/api/campaigns";
import { runOptimizationLoop, runAutoExperiment } from "@/lib/api/optimize";
import type { CampaignResponse, OptimizationLoopResponse } from "@/lib/types";
import { OptimizationPanel } from "@/components/optimize/OptimizationPanel";
import { AgentThinking } from "@/components/ui/AgentThinking";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";

export default function OptimizePage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<OptimizationLoopResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listCampaigns();
        setCampaigns(response.campaigns);
      } catch (error) {
        toast.error("Failed to load campaigns.");
        setError("Campaign list unavailable.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRunLoop = async (campaignId: string, iterations: number) => {
    try {
      setRunning(true);
      const response = await runOptimizationLoop({ campaign_id: campaignId, iterations });
      setResults(response);
      toast.success("Optimization loop complete.");
    } catch (error) {
      toast.error("Optimization failed.");
    } finally {
      setRunning(false);
    }
  };

  const handleAutoExperiment = async (campaignId: string, numVariants: number) => {
    try {
      setRunning(true);
      await runAutoExperiment(campaignId, numVariants);
      toast.success("Auto experiment triggered.");
    } catch (error) {
      toast.error("Auto experiment failed.");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <ErrorState title="Optimize unavailable" description={error} onRetry={() => window.location.reload()} />;
  }

  if (!campaigns.length) {
    return (
      <EmptyState
        title="No campaigns to optimize"
        description="Create a campaign first to run optimization loops."
        actionLabel="Create Campaign"
        onAction={() => (window.location.href = "/campaigns/new")}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <OptimizationPanel
        campaigns={campaigns}
        onRunLoop={handleRunLoop}
        onAutoExperiment={handleAutoExperiment}
        loading={running}
      />
      <div className="space-y-4">
        <h2 className="section-underline font-display text-2xl">Iteration Feed</h2>
        {running && <AgentThinking message="Optimization loop running" />}
        {results?.iterations?.map((iteration) => (
          <Card key={iteration.iteration} className="space-y-3 p-5">
            <p className="font-display text-2xl text-sand-900">Iteration {iteration.iteration}</p>
            <p className="text-sm text-sand-600">{iteration.strategy}</p>
            <div className="flex flex-wrap gap-2">
              {iteration.new_variants.map((variant) => (
                <span key={variant.id} className="rounded-full bg-sand-200 px-2 py-1 text-xs text-sand-700">
                  {variant.creative.headline.slice(0, 18)}
                </span>
              ))}
            </div>
            <p className="text-xs text-sand-500">Projected CTR {(iteration.current_best_ctr * 100).toFixed(2)}%</p>
          </Card>
        ))}
        {!running && !results && (
          <Card className="p-6 text-sm text-sand-600">Run an optimization loop to see results here.</Card>
        )}
      </div>
    </div>
  );
}
