import { apiClient } from "./client";
import type { VariantGenerateRequest, VariantGenerateResponse, VariantListResponse, Variant } from "@/lib/types";

export const listVariants = (campaignId: string) =>
  apiClient.get<VariantListResponse>(`/api/v1/variants/campaign/${campaignId}`).then((r) => r.data);

export const getVariant = (variantId: string) =>
  apiClient.get<Variant>(`/api/v1/variants/${variantId}`).then((r) => r.data);

export const generateVariants = (data: VariantGenerateRequest) =>
  apiClient.post<VariantGenerateResponse>(`/api/v1/variants/generate`, data).then((r) => r.data);

export const predictVariants = (campaign_id: string, variant_ids: string[]) =>
  apiClient
    .post<{ variants?: Variant[]; analysis?: string }>(`/api/v1/variants/predict`, { campaign_id, variant_ids })
    .then((r) => r.data);
