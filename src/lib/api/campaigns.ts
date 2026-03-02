import { apiClient } from "./client";
import type { CampaignCreate, CampaignListResponse, CampaignResponse, CampaignOverview } from "@/lib/types";

export const listCampaigns = () =>
  apiClient.get<CampaignListResponse>("/api/v1/campaigns/").then(r => r.data);

export const getCampaign = (id: string) =>
  apiClient.get<CampaignResponse>(`/api/v1/campaigns/${id}`).then(r => r.data);

export const getCampaignOverview = (id: string) =>
  apiClient.get<CampaignOverview>(`/api/v1/campaigns/${id}/overview`).then(r => r.data);

export const createCampaign = (data: CampaignCreate) =>
  apiClient.post<CampaignResponse>("/api/v1/campaigns/", data).then(r => r.data);
