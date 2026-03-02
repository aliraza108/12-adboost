import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CampaignResponse } from "@/lib/types";

type CampaignCardProps = {
  campaign: CampaignResponse;
  stats?: {
    variants: number;
    experiments: number;
    bestCtr: number | null;
  };
};

export function CampaignCard({ campaign, stats }: CampaignCardProps) {
  return (
    <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,58,30,0.12)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl text-sand-900">{campaign.name}</h3>
          <p className="mt-1 max-w-[38ch] truncate text-sm italic text-sand-600">{campaign.audience_segment}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge goal={campaign.goal}>{campaign.goal}</Badge>
          <span className="flex items-center gap-2 text-xs text-sand-600">
            <span
              className={`h-2 w-2 rounded-full ${campaign.status === "active" ? "bg-sage" : "bg-sand-300"}`}
            />
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-sand-600">
        <div>
          <p className="uppercase tracking-[0.2em] text-sand-500">Variants</p>
          <p className="mt-1 font-mono text-sand-800">{stats?.variants ?? 0}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em] text-sand-500">Experiments</p>
          <p className="mt-1 font-mono text-sand-800">{stats?.experiments ?? 0}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em] text-sand-500">Best CTR</p>
          <p className="mt-1 font-mono text-sand-800">
            {typeof stats?.bestCtr === "number" ? `${(stats.bestCtr * 100).toFixed(2)}%` : "-"}
          </p>
        </div>
      </div>

      <Link href={`/campaigns/${campaign.id}`} className="mt-4 inline-flex text-sm text-terracotta hover:underline">
        View Campaign
      </Link>
    </Card>
  );
}
