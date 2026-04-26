import type { DashboardOverviewSnapshot } from "@/features/dashboard/overview-data"

export const mockDashboardOverview: DashboardOverviewSnapshot = {
  activeWorkspaces: 18,
  healthyWorkspaces: 14,
  stableChannelWorkspaces: 11,
  installPulls30d: 48200,
  previewSessions30d: 17200,
  releaseHealthPercent: 96.4,
  recentFailedPublishCount: 2,
  workspacesNeedingReview: 4,
}

