import type { WorkspaceRecord } from "@/features/workspaces/workspace-data"
import { Activity, Boxes, GitBranch, RefreshCw } from "lucide-react"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import { StatCard } from "@/components/dashboard/stat-card"

export interface WorkspaceSummaryCardsProps {
  workspaces: WorkspaceRecord[]
}

export function WorkspaceSummaryCards({
  workspaces,
}: WorkspaceSummaryCardsProps) {
  const locale = useLocale()
  const t = useTranslations("dashboardContent.workspaces")
  const compactNumberFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  })
  const totalInstalls = workspaces.reduce(
    (sum, workspace) => sum + workspace.monthlyInstalls,
    0
  )
  const healthyWorkspaces = workspaces.filter(
    (workspace) => workspace.status === "Healthy"
  )
  const syncingWorkspaces = workspaces.filter(
    (workspace) => workspace.status === "Syncing"
  )
  const stableWorkspaces = workspaces.filter(
    (workspace) => workspace.releaseChannel === "Stable"
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("summary.visible")}
        value={String(workspaces.length)}
        trend={t("summary.visibleTrend", { count: healthyWorkspaces.length })}
        meta={t("summary.visibleMeta")}
        icon={<Boxes className="size-4" />}
      />
      <StatCard
        label={t("summary.installs")}
        value={compactNumberFormatter.format(totalInstalls)}
        trend={t("summary.installsTrend", { count: syncingWorkspaces.length })}
        meta={t("summary.installsMeta")}
        icon={<Activity className="size-4" />}
      />
      <StatCard
        label={t("summary.review")}
        value={String(
          workspaces.filter((workspace) => workspace.status === "Needs review")
            .length
        )}
        trend={t("summary.reviewTrend")}
        meta={t("summary.reviewMeta")}
        icon={<RefreshCw className="size-4" />}
      />
      <StatCard
        label={t("summary.stable")}
        value={String(stableWorkspaces.length)}
        trend={t("summary.stableTrend")}
        meta={t("summary.stableMeta")}
        icon={<GitBranch className="size-4" />}
      />
    </div>
  )
}
