import { create } from "zustand";

type AdBoostState = {
  activeCampaignId: string | null;
  setActiveCampaignId: (id: string | null) => void;
};

export const useAdBoostStore = create<AdBoostState>((set) => ({
  activeCampaignId: null,
  setActiveCampaignId: (id) => set({ activeCampaignId: id })
}));
