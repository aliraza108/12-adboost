import { apiClient } from "./client";
import type { AnalyticsReport, AnalyticsTrends } from "@/lib/types";

export const getCampaignReport = (id: string) =>
  apiClient.get<AnalyticsReport>(`/api/v1/analytics/campaign/${id}/report`).then(r => r.data);

export const getCampaignTrends = (id: string) =>
  apiClient.get<AnalyticsTrends>(`/api/v1/analytics/campaign/${id}/trends`).then(r => r.data);

export const getExperimentInsights = (id: string) =>
  apiClient.get(`/api/v1/analytics/experiment/${id}/insights`).then(r => r.data);
