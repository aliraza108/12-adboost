"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { getCampaignOverview } from "@/lib/api/campaigns";
import { getOptimizationStatus } from "@/lib/api/optimize";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "sonner";
import type { CampaignOverview, OptimizationStatus } from "@/lib/types";

export default function CampaignOverviewPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [overview, setOverview] = useState<CampaignOverview | null>(null);
  const [status, setStatus] = useState<OptimizationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const overviewData = await getCampaignOverview(campaignId);
        if (mounted) setOverview(overviewData);

        try {
          const statusData = await getOptimizationStatus(campaignId);
          if (mounted) setStatus(statusData);
        } catch {
          if (mounted) setStatus(null);
        }
      } catch (error: unknown) {
        const detail = axios.isAxiosError(error)
          ? (error.response?.data as { detail?: string } | undefined)?.detail
          : undefined;
        toast.error(detail ?? "Unable to load campaign overview.");
        if (mounted) setError(detail ?? "Campaign overview could not be loaded.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (campaignId) load();
    return () => {
      mounted = false;
    };
  }, [campaignId]);

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <ErrorState title="Campaign unavailable" description={error} onRetry={() => window.location.reload()} />;
  }

  if (!overview) {
    return <Card className="p-6">Unable to load campaign.</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{overview.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge goal={overview.goal}>{overview.goal}</Badge>
            <Badge status={overview.status === "active" ? "active" : "paused"}>{overview.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/campaigns/${campaignId}/variants`}>
            <Button variant="secondary">Generate Variants</Button>
          </Link>
          <Link href={`/campaigns/${campaignId}/experiments`}>
            <Button variant="primary">Run Auto-Experiment</Button>
          </Link>
          <Link href="/optimize">
            <Button variant="ghost">Optimize Loop</Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 border-b border-sand-200 text-sm">
        <Link className="pb-3 text-terracotta" href={`/campaigns/${campaignId}`}>
          Overview
        </Link>
        <Link className="pb-3 text-sand-600 hover:text-terracotta" href={`/campaigns/${campaignId}/variants`}>
          Variants
        </Link>
        <Link className="pb-3 text-sand-600 hover:text-terracotta" href={`/campaigns/${campaignId}/experiments`}>
          Experiments
        </Link>
        <Link className="pb-3 text-sand-600 hover:text-terracotta" href={`/campaigns/${campaignId}/analytics`}>
          Analytics
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-xl">Base Creative</h2>
          <div className="space-y-2 text-sm text-sand-700">
            <p><span className="text-sand-500">Headline:</span> {overview.base_creative?.headline}</p>
            <p><span className="text-sand-500">Body:</span> {overview.base_creative?.body ?? "-"}</p>
            <p><span className="text-sand-500">CTA:</span> {overview.base_creative?.cta}</p>
          </div>
        </Card>
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-xl">Stats</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-sand-600">
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Variants</p>
              <p className="font-display text-2xl text-sand-900">{overview.stats?.variants_generated ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Experiments</p>
              <p className="font-display text-2xl text-sand-900">{overview.stats?.experiments_run ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Best CTR</p>
              <p className="font-display text-2xl text-sand-900">{overview.stats?.best_ctr ? `${(overview.stats.best_ctr * 100).toFixed(2)}%` : "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Winners</p>
              <p className="font-display text-2xl text-sand-900">{overview.stats?.winners_found ?? 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-3 p-6">
        <h2 className="font-display text-xl">Optimization Phase</h2>
        <p className="text-sm text-sand-600">{status?.phase ?? "No status available"}</p>
        <div className="h-3 w-full rounded-full bg-sand-200">
          <div
            className="h-full rounded-full bg-terracotta"
            style={{ width: `${status?.progress_pct ?? 0}%` }}
          />
        </div>
        <p className="text-xs text-sand-500">Recommended: {status?.recommended_next_action ?? "-"}</p>
      </Card>
    </div>
  );
}
