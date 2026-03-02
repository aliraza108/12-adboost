import axios from "axios";

export const getApiErrorDetail = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const payload = error.response?.data as { detail?: string } | undefined;
  return payload?.detail;
};

export const isNotFoundError = (error: unknown, resource?: string) => {
  if (!axios.isAxiosError(error)) return false;
  if (error.response?.status === 404) {
    if (!resource) return true;
    const detail = getApiErrorDetail(error)?.toLowerCase() ?? "";
    return detail.includes(resource.toLowerCase()) || detail.includes("not found");
  }
  const detail = getApiErrorDetail(error)?.toLowerCase() ?? "";
  if (!detail.includes("not found")) return false;
  return !resource || detail.includes(resource.toLowerCase());
};

export const getCampaignNotFoundMessage = (campaignId: string) =>
  `Campaign ${campaignId} no longer exists or is unavailable in this environment.`;
