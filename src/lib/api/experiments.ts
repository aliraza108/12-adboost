import { apiClient } from "./client";
import type {
  Experiment,
  ExperimentAnalyzeResponse,
  ExperimentCreate,
  ExperimentListResponse,
  ExperimentSimulateRequest
} from "@/lib/types";

export const listExperiments = (campaignId: string) =>
  apiClient.get<ExperimentListResponse>(`/api/v1/experiments/campaign/${campaignId}`).then((r) => r.data);

export const getExperiment = (id: string) =>
  apiClient.get<Experiment>(`/api/v1/experiments/${id}`).then((r) => r.data);

export const createExperiment = (data: ExperimentCreate) =>
  apiClient.post<Experiment>(`/api/v1/experiments/`, data).then((r) => r.data);

export const simulateExperiment = (data: ExperimentSimulateRequest) =>
  apiClient.post<{ detail?: string }>(`/api/v1/experiments/simulate`, data).then((r) => r.data);

export const analyzeExperiment = (id: string) =>
  apiClient.post<ExperimentAnalyzeResponse>(`/api/v1/experiments/${id}/analyze`).then((r) => r.data);
