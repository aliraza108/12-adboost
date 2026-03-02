"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCampaigns } from "@/lib/api/campaigns";
import type { CampaignResponse } from "@/lib/types";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listCampaigns();
        if (mounted) setCampaigns(response.campaigns);
      } catch (error) {
        toast.error("Unable to load campaigns.");
        if (mounted) setError("Campaign data couldn't be fetched.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
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
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-36" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Campaigns offline" description={error} onRetry={() => window.location.reload()} />
      ) : campaigns.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
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
