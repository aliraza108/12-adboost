export type CampaignGoal = "clicks" | "signups" | "sales" | "impressions" | "leads";
export type CampaignStatus = "active" | "paused" | "archived";

export type BaseCreative = {
  headline: string;
  body?: string | null;
  cta: string;
  image_description?: string | null;
};

export type CampaignCreate = {
  name: string;
  goal: CampaignGoal;
  audience_segment: string;
  base_creative: BaseCreative;
  budget?: number | null;
  tags?: string[];
};

export type CampaignResponse = {
  id: string;
  name: string;
  goal: CampaignGoal;
  audience_segment: string;
  base_creative: BaseCreative;
  status: CampaignStatus;
  created_at: string;
  budget?: number | null;
  tags?: string[];
};

export type CampaignOverview = CampaignResponse & {
  stats?: {
    variants_generated?: number;
    experiments_run?: number;
    best_ctr?: number | null;
    winners_found?: number;
  };
};

export type CampaignListResponse = {
  campaigns: CampaignResponse[];
  total: number;
};

export type VariantStatus = "draft" | "testing" | "winner" | "loser" | "paused";

export type Variant = {
  id: string;
  campaign_id: string;
  creative: {
    headline: string;
    body?: string | null;
    cta: string;
    image_description?: string | null;
    tone?: string | null;
    emotional_trigger?: string | null;
    ai_reasoning?: string | null;
  };
  predictions?: {
    predicted_ctr?: number | null;
    predicted_cvr?: number | null;
    engagement_score?: number | null;
  } | null;
  status: VariantStatus;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr?: number | null;
  cvr?: number | null;
  created_at: string;
};

export type VariantListResponse = {
  total: number;
  variants: Variant[];
};

export type VariantGenerateRequest = {
  campaign_id: string;
  num_variants: number;
  tones: string[];
  focus_element: "all" | "headline" | "cta" | "body";
};

export type VariantGenerateResponse = {
  variants?: Variant[];
  agent_summary?: string;
};

export type ExperimentStatus = "running" | "completed" | "paused" | "insufficient_data";

export type Experiment = {
  id: string;
  campaign_id: string;
  variant_ids: string[];
  status: ExperimentStatus;
  winner_id?: string | null;
  statistical_significance?: number | null;
  confidence_level?: number | null;
  traffic_split?: Record<string, number> | null;
  target_sample_size?: number | null;
  created_at: string;
};

export type ExperimentListResponse = {
  total: number;
  experiments: Experiment[];
};

export type ExperimentCreate = {
  campaign_id: string;
  variant_ids: string[];
  traffic_split?: Record<string, number> | null;
  target_sample_size: number;
  confidence_level: number;
  duration_hours: number;
};

export type ExperimentSimulateRequest = {
  experiment_id: string;
  num_events: number;
};

export type ExperimentAnalyzeResponse = {
  statistical_significance?: number;
  winner_id?: string | null;
  details?: string;
};

export type AnalyticsReport = {
  campaign_id: string;
  campaign_name: string;
  total_experiments: number;
  completed_experiments: number;
  winners_identified: number;
  total_variants_tested: number;
  performance_summary: {
    best_ctr: number;
    total_impressions: number;
    total_clicks: number;
  };
  ai_report: string;
  winners: Variant[];
};

export type AnalyticsTrends = {
  campaign_id: string;
  total_variants: number;
  tone_performance_avg: Record<string, number>;
  top_performer: Variant;
  bottom_performer: Variant;
  all_variants_ranked: Variant[];
};

export type OptimizationStatus = {
  campaign_id: string;
  phase: string;
  progress_pct: number;
  stats: {
    variants_generated: number;
    experiments_run: number;
    experiments_completed: number;
    winners_found: number;
  };
  best_variant?: {
    headline: string;
    ctr: number;
  } | null;
  recommended_next_action?: string | null;
};

export type OptimizationRequest = {
  campaign_id: string;
  iterations: number;
};

export type OptimizationLoopResponse = {
  campaign_id: string;
  optimization_complete: boolean;
  total_iterations: number;
  total_variants_in_system: number;
  iterations: Array<{
    iteration: number;
    variants_before: number;
    variants_after: number;
    new_variants_created: number;
    current_best_ctr: number;
    strategy: string;
    new_variants: Variant[];
  }>;
  next_step: string;
};
