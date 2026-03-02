"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCampaignOverview, listCampaigns } from "@/lib/api/campaigns";
import type { CampaignResponse } from "@/lib/types";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";

type CampaignStatsMap = Record<
  string,
  {
    variants: number;
    experiments: number;
    bestCtr: number | null;
  }
>;

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [statsByCampaign, setStatsByCampaign] = useState<CampaignStatsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listCampaigns();
      setCampaigns(response.campaigns);

      const overviews = await Promise.all(
        response.campaigns.map(async (campaign) => {
          try {
            const overview = await getCampaignOverview(campaign.id);
            return {
              id: campaign.id,
              variants: overview.stats?.variants_generated ?? 0,
              experiments: overview.stats?.experiments_run ?? 0,
              bestCtr: overview.stats?.best_ctr ?? null
            };
          } catch {
            return { id: campaign.id, variants: 0, experiments: 0, bestCtr: null };
          }
        })
      );

      const map = overviews.reduce<CampaignStatsMap>((acc, item) => {
        acc[item.id] = {
          variants: item.variants,
          experiments: item.experiments,
          bestCtr: item.bestCtr
        };
        return acc;
      }, {});
      setStatsByCampaign(map);
    } catch {
      toast.error("Unable to load campaigns.");
      setError("Campaign data couldn't be fetched.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Campaigns</h1>
          <p className="text-sm text-sand-600">Manage all active A/B programs.</p>
        </div>
        <Link href="/campaigns/new">
          <Button variant="primary">New Campaign</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-44" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Campaigns offline" description={error} onRetry={load} />
      ) : campaigns.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.06 }}
            >
              <CampaignCard campaign={campaign} stats={statsByCampaign[campaign.id]} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No campaigns yet"
          description="Create your first campaign to start generating AI variants."
          actionLabel="Create Campaign"
          onAction={() => (window.location.href = "/campaigns/new")}
        />
      )}
    </div>
  );
}
