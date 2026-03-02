"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy } from "lucide-react";
import { getCampaignReport, getCampaignTrends } from "@/lib/api/analytics";
import { getApiErrorDetail, getCampaignNotFoundMessage, isNotFoundError } from "@/lib/api/errors";
import { CTRChart } from "@/components/analytics/CTRChart";
import { WinnerBanner } from "@/components/analytics/WinnerBanner";
import { PatternsList } from "@/components/analytics/PatternsList";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AgentThinking } from "@/components/ui/AgentThinking";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import type { AnalyticsReport, AnalyticsTrends, Variant } from "@/lib/types";

const renderMarkdown = (markdown: string) => {
  return markdown.split("\n").map((line, index) => {
    if (line.startsWith("### ")) {
      return (
        <h4 key={index} className="mt-4 font-display text-lg">
          {line.replace("### ", "")}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={index} className="mt-4 font-display text-xl">
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h2 key={index} className="mt-4 font-display text-2xl">
          {line.replace("# ", "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={index} className="ml-4 list-disc text-sm text-sand-700">
          {line.replace("- ", "")}
        </li>
      );
    }
    if (!line.trim()) {
      return <div key={index} className="h-2" />;
    }
    return (
      <p key={index} className="mt-2 text-sm text-sand-700">
        {line}
      </p>
    );
  });
};

export default function AnalyticsPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reportData, trendsData] = await Promise.all([
          getCampaignReport(campaignId),
          getCampaignTrends(campaignId)
        ]);
        if (mounted) {
          setReport(reportData);
          setTrends(trendsData);
        }
      } catch (error: unknown) {
        const detail = getApiErrorDetail(error);
        const message = isNotFoundError(error, "campaign")
          ? getCampaignNotFoundMessage(campaignId)
          : (detail ?? "Analytics data couldn't be fetched.");
        toast.error(message);
        if (mounted) setError(message);
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
    return (
      <div className="space-y-4">
        <AgentThinking message="AI is compiling your report" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Analytics unavailable"
        description={error}
        onRetry={() => window.location.reload()}
        actionLabel="Back to Campaigns"
        onAction={() => (window.location.href = "/campaigns")}
      />
    );
  }

  const chartData =
    trends?.all_variants_ranked?.map((variant: Variant) => ({
      name: `${variant.creative.headline.slice(0, 16)}...`,
      predicted: variant.predictions?.predicted_ctr ?? 0,
      actual: variant.ctr ?? 0
    })) ?? [];

  const winner = report?.winners?.[0];

  const recommendations =
    (trends?.all_variants_ranked ?? []).slice(0, 4).map((variant: Variant) => {
      const tone = variant.creative.tone?.replace(/_/g, " ") ?? "top-performing";
      return `Prioritize ${tone} messaging: "${variant.creative.headline}"`;
    }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Analytics</h1>
        <p className="text-sm text-sand-600">Performance and AI insights.</p>
      </div>

      <Card className="p-6">
        <h2 className="section-underline font-display text-2xl">Performance Chart</h2>
        <div className="mt-6">
          <CTRChart data={chartData} />
        </div>
      </Card>

      {winner && (
        <WinnerBanner
          headline={winner.creative.headline}
          ctr={winner.ctr ?? 0}
          cvr={winner.cvr ?? 0}
          significance={report?.performance_summary?.best_ctr ?? 0}
        />
      )}

      <Card className="p-6">
        <h2 className="section-underline font-display text-2xl">Winning Patterns</h2>
        <div className="mt-6">
          <PatternsList
            patterns={Object.entries(trends?.tone_performance_avg ?? {}).map(([tone, value]) => ({
              title: tone.replace(/_/g, " "),
              description: `Average CTR ${(Number(value) * 100).toFixed(2)}% for this tone.`
            }))}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="section-underline font-display text-2xl">AI Report</h2>
        <details className="mt-4 rounded-lg border border-sand-200 bg-warm-white p-4 open:shadow-soft">
          <summary className="cursor-pointer text-sm font-medium text-sand-700">View full agent report</summary>
          <div className="mt-3 space-y-1">{report?.ai_report ? renderMarkdown(report.ai_report) : "No report."}</div>
        </details>
      </Card>

      <Card className="p-6">
        <h2 className="section-underline font-display text-2xl">Recommendations</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation, index) => (
            <Card key={`${recommendation}-${index}`} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-warm-white">
                    <span className="font-display text-xl">{index + 1}</span>
                  </div>
                  <p className="text-sm text-sand-700">{recommendation}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(recommendation);
                    toast.success("Recommendation copied.");
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
