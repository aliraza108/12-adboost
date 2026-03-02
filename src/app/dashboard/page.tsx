"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { listCampaigns, getCampaignOverview } from "@/lib/api/campaigns";
import type { CampaignResponse } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "sonner";

type CampaignStatsMap = Record<
  string,
  {
    variants: number;
    experiments: number;
    bestCtr: number | null;
    winners: number;
  }
>;

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsByCampaign, setStatsByCampaign] = useState<CampaignStatsMap>({});
  const [stats, setStats] = useState({
    variants: 0,
    experiments: 0,
    winners: 0
  });

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const campaignResponse = await listCampaigns();
      setCampaigns(campaignResponse.campaigns);

      const overviews = await Promise.all(
        campaignResponse.campaigns.map(async (campaign) => {
          try {
            const overview = await getCampaignOverview(campaign.id);
            return {
              id: campaign.id,
              variants: overview?.stats?.variants_generated ?? 0,
              experiments: overview?.stats?.experiments_run ?? 0,
              bestCtr: overview?.stats?.best_ctr ?? null,
              winners: overview?.stats?.winners_found ?? 0
            };
          } catch {
            return { id: campaign.id, variants: 0, experiments: 0, bestCtr: null, winners: 0 };
          }
        })
      );

      const totals = overviews.reduce(
        (acc, item) => {
          acc.variants += item.variants;
          acc.experiments += item.experiments;
          acc.winners += item.winners;
          return acc;
        },
        { variants: 0, experiments: 0, winners: 0 }
      );
      setStats(totals);

      const map = overviews.reduce<CampaignStatsMap>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setStatsByCampaign(map);
    } catch {
      toast.error("Failed to load campaigns.");
      setError("We couldn't reach the campaign data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total Campaigns"
          value={String(campaigns.length)}
          badge={`${campaigns.filter((c) => c.status === "active").length} Active`}
        />
        <StatCard label="Variants Generated" value={stats.variants.toString()} />
        <StatCard label="Experiments Run" value={stats.experiments.toString()} />
        <StatCard label="Winners Found" value={stats.winners.toString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <h2 className="section-underline font-display text-2xl">Recent Campaigns</h2>
          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-44" />
              ))}
            </div>
          ) : error ? (
            <ErrorState title="Campaigns unavailable" description={error} onRetry={load} />
          ) : (
            <div className="grid gap-4">
              {campaigns.slice(0, 5).map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <CampaignCard
                    campaign={campaign}
                    stats={
                      statsByCampaign[campaign.id]
                        ? {
                            variants: statsByCampaign[campaign.id].variants,
                            experiments: statsByCampaign[campaign.id].experiments,
                            bestCtr: statsByCampaign[campaign.id].bestCtr
                          }
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="section-underline font-display text-2xl">Optimization Activity</h2>
          <Card className="space-y-4 p-5">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-terracotta" />
                <div>
                  <p className="text-sm text-sand-800">
                    {campaign.name}: {statsByCampaign[campaign.id]?.variants ?? 0} variants,{" "}
                    {statsByCampaign[campaign.id]?.experiments ?? 0} experiments
                  </p>
                  <p className="text-xs text-sand-500">
                    Created {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {!campaigns.length && <p className="text-sm text-sand-600">No activity yet.</p>}
          </Card>
        </div>
      </div>

      <Card className="flex flex-col items-start gap-4 bg-terracotta p-6 text-warm-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl">Start Optimizing</h2>
          <p className="mt-2 text-sm text-warm-white/90">
            Launch a new AI optimization loop to unlock your next winning creative.
          </p>
        </div>
        <Link href="/optimize">
          <Button variant="secondary" className="bg-warm-white text-terracotta">
            Open Optimize
          </Button>
        </Link>
      </Card>
    </div>
  );
}
