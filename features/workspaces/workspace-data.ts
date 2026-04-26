export type WorkspaceStatus = "Healthy" | "Syncing" | "Needs review"
export type WorkspaceFramework = "Next.js" | "Vite" | "Monorepo"
export type WorkspaceStyle = "New York v4" | "Radix Nova" | "Base Nova"
export type WorkspaceReleaseChannel = "Stable" | "Beta" | "Canary"

export interface WorkspaceRecord {
  id: string
  name: string
  team: string
  teamEmail: string
  framework: WorkspaceFramework
  style: WorkspaceStyle
  releaseChannel: WorkspaceReleaseChannel
  status: WorkspaceStatus
  installedComponents: number
  monthlyInstalls: number
  lastReleaseLabel: string
}

export const workspaceStatuses: Array<"all" | WorkspaceStatus> = [
  "all",
  "Healthy",
  "Syncing",
  "Needs review",
]

export const workspaceFrameworks: Array<"all" | WorkspaceFramework> = [
  "all",
  "Next.js",
  "Vite",
  "Monorepo",
]

export function getWorkspaceStatusKey(status: WorkspaceStatus) {
  switch (status) {
    case "Syncing":
      return "syncing"
    case "Needs review":
      return "needsReview"
    case "Healthy":
    default:
      return "healthy"
  }
}

export function getWorkspaceFrameworkKey(framework: WorkspaceFramework) {
  switch (framework) {
    case "Vite":
      return "vite"
    case "Monorepo":
      return "monorepo"
    case "Next.js":
    default:
      return "nextjs"
  }
}

export function getWorkspaceReleaseChannelKey(
  channel: WorkspaceReleaseChannel
) {
  switch (channel) {
    case "Beta":
      return "beta"
    case "Canary":
      return "canary"
    case "Stable":
    default:
      return "stable"
  }
}
