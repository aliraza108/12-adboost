import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CampaignResponse } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: CampaignResponse }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl text-sand-900">{campaign.name}</h3>
          <p className="mt-1 text-sm italic text-sand-600">
            {campaign.audience_segment}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge goal={campaign.goal}>
            {campaign.goal}
          </Badge>
          <span className="flex items-center gap-2 text-xs text-sand-600">
            <span
              className={`h-2 w-2 rounded-full ${campaign.status === "active" ? "bg-sage" : "bg-sand-300"}`}
            />
            {campaign.status}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-sand-600">
        <span>Budget {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "-"}</span>
        <span>Tags {campaign.tags?.length ? campaign.tags.join(", ") : "None"}</span>
      </div>
      <Link
        href={`/campaigns/${campaign.id}`}
        className="mt-4 inline-flex text-sm text-terracotta hover:underline"
      >
        View Campaign ->
      </Link>
    </Card>
  );
}
