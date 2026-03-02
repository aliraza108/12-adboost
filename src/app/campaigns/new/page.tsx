"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { createCampaign } from "@/lib/api/campaigns";
import type { CampaignCreate } from "@/lib/types";
import { toast } from "sonner";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CampaignCreate) => {
    try {
      setLoading(true);
      const response = await createCampaign(data);
      toast.success("Campaign created!");
      router.push(`/campaigns/${response.id}`);
    } catch (error) {
      toast.error("Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">New Campaign</h1>
        <p className="text-sm text-sand-600">Define the base creative to power AI iterations.</p>
      </div>
      <div className="mx-auto max-w-[680px]">
        <CampaignForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
