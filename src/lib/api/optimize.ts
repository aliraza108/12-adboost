import { apiClient } from "./client";
import type { OptimizationRequest, OptimizationLoopResponse, OptimizationStatus } from "@/lib/types";

export const getOptimizationStatus = (campaignId: string) =>
  apiClient.get<OptimizationStatus>(`/api/v1/optimize/campaign/${campaignId}/status`).then((r) => r.data);

export const runOptimizationLoop = (data: OptimizationRequest) =>
  apiClient.post<OptimizationLoopResponse>(`/api/v1/optimize/loop`, data).then((r) => r.data);

export const runAutoExperiment = (campaign_id: string, num_variants = 3) =>
  apiClient
    .post<{ detail?: string }>(`/api/v1/optimize/auto-experiment?campaign_id=${campaign_id}&num_variants=${num_variants}`)
    .then((r) => r.data);
