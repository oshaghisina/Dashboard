import {
  getWorkspaceStatusKey,
  type WorkspaceStatus,
} from "@/features/workspaces/workspace-data"

import { useTranslations } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"

export interface WorkspaceStatusBadgeProps {
  status: WorkspaceStatus
}

function getStatusVariant(status: WorkspaceStatus) {
  switch (status) {
    case "Healthy":
      return "default"
    case "Syncing":
      return "secondary"
    case "Needs review":
      return "outline"
  }
}

export function WorkspaceStatusBadge({ status }: WorkspaceStatusBadgeProps) {
  const t = useTranslations("dashboardContent.workspaces.statuses")

  return (
    <Badge variant={getStatusVariant(status)}>
      {t(getWorkspaceStatusKey(status))}
    </Badge>
  )
}
