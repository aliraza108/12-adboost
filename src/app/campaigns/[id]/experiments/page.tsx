"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listExperiments, createExperiment, simulateExperiment, analyzeExperiment } from "@/lib/api/experiments";
import { listVariants } from "@/lib/api/variants";
import type { Experiment, Variant } from "@/lib/types";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { CreateExperimentForm } from "@/components/experiments/CreateExperimentForm";
import { Button } from "@/components/ui/Button";
import { AgentThinking } from "@/components/ui/AgentThinking";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";

export default function ExperimentsPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [experimentResponse, variantResponse] = await Promise.all([
        listExperiments(campaignId),
        listVariants(campaignId)
      ]);
      setExperiments(experimentResponse.experiments);
      setVariants(variantResponse.variants);
    } catch (error) {
      toast.error("Failed to load experiments.");
      setError("Experiments couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) load();
  }, [campaignId]);

  const handleCreate = async (data: {
    variant_ids: string[];
    confidence_level: number;
    target_sample_size: number;
    duration_hours: number;
    traffic_split?: Record<string, number> | null;
  }) => {
    try {
      setAiLoading(true);
      await createExperiment({ campaign_id: campaignId, ...data });
      toast.success("Experiment created.");
      setModalOpen(false);
      await load();
    } catch (error) {
      toast.error("Failed to create experiment.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSimulate = async (id: string, numEvents: number) => {
    try {
      setAiLoading(true);
      await simulateExperiment({ experiment_id: id, num_events: numEvents });
      toast.success("Simulation completed.");
    } catch (error) {
      toast.error("Simulation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnalyze = async (id: string) => {
    try {
      setAiLoading(true);
      await analyzeExperiment(id);
      toast.success("Analysis complete.");
      await load();
    } catch (error) {
      toast.error("Analysis failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Experiments</h1>
          <p className="text-sm text-sand-600">Run tests and validate winners.</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Create Experiment
        </Button>
      </div>

      {aiLoading && <AgentThinking message="Agent analyzing experiment data" />}

      {loading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-40" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Experiments unavailable" description={error} onRetry={load} />
      ) : experiments.length ? (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              onAnalyze={handleAnalyze}
              onSimulate={handleSimulate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No experiments yet"
          description="Create an experiment to start validating your variants."
          actionLabel="Create Experiment"
          onAction={() => setModalOpen(true)}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-sand-900/40">
          <div className="w-full max-w-2xl overflow-y-auto rounded-2xl bg-sand-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Create Experiment</h2>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <div className="mt-4">
              <CreateExperimentForm variants={variants.filter((v) => v.status === "draft")} onSubmit={handleCreate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
