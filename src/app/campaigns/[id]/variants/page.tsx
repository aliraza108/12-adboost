"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { listVariants, generateVariants } from "@/lib/api/variants";
import type { Variant } from "@/lib/types";
import { VariantCard } from "@/components/variants/VariantCard";
import { GenerateVariantsForm } from "@/components/variants/GenerateVariantsForm";
import { Button } from "@/components/ui/Button";
import { AgentThinking } from "@/components/ui/AgentThinking";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";

export default function VariantsPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listVariants(campaignId);
      setVariants(response.variants);
    } catch (error) {
      toast.error("Failed to load variants.");
      setError("Variants couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) load();
  }, [campaignId]);

  const handleGenerate = async (payload: {
    num_variants: number;
    tones: string[];
    focus_element: "all" | "headline" | "cta" | "body";
  }) => {
    try {
      setGenerating(true);
      await generateVariants({ campaign_id: campaignId, ...payload });
      toast.success("Variants generated.");
      await load();
    } catch (error) {
      toast.error("Variant generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Variants</h1>
          <p className="text-sm text-sand-600">Generate and compare creative options.</p>
        </div>
        <Button variant="primary" onClick={() => setPanelOpen(true)}>
          Generate Variants
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-48" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Variants unavailable" description={error} onRetry={load} />
      ) : variants.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: index * 0.05 }}
            >
              <VariantCard variant={variant} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No variants yet"
          description="Generate your first batch of creative variants."
          actionLabel="Generate Variants"
          onAction={() => setPanelOpen(true)}
        />
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-sand-900/30">
          <div className="h-full w-full max-w-md overflow-y-auto bg-sand-50 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Generate Variants</h2>
              <Button variant="ghost" onClick={() => setPanelOpen(false)}>
                Close
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {generating ? (
                <AgentThinking message="AI is writing variants" />
              ) : (
                <GenerateVariantsForm onSubmit={handleGenerate} loading={generating} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
