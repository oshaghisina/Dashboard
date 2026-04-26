export interface DashboardOverviewSnapshot {
  activeWorkspaces: number
  healthyWorkspaces: number
  stableChannelWorkspaces: number
  installPulls30d: number
  previewSessions30d: number
  releaseHealthPercent: number
  recentFailedPublishCount: number
  workspacesNeedingReview: number
}

export const emptyDashboardOverviewSnapshot: DashboardOverviewSnapshot = {
  activeWorkspaces: 0,
  healthyWorkspaces: 0,
  stableChannelWorkspaces: 0,
  installPulls30d: 0,
  previewSessions30d: 0,
  releaseHealthPercent: 100,
  recentFailedPublishCount: 0,
  workspacesNeedingReview: 0,
}
