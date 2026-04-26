"use client"

import * as React from "react"
import Link from "next/link"
import { useWorkspaceColumns } from "@/features/workspaces/workspace-columns"
import {
  type WorkspaceFramework,
  type WorkspaceRecord,
  type WorkspaceStatus,
} from "@/features/workspaces/workspace-data"
import { WorkspaceListFilters } from "@/features/workspaces/workspace-list-filters"
import { WorkspaceSummaryCards } from "@/features/workspaces/workspace-summary-cards"
import { Download, Plus } from "lucide-react"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import { localizePathname, type AppLocale } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { TableSection } from "@/components/dashboard/table-section"

export interface WorkspacesPageProps {
  initialWorkspaces: WorkspaceRecord[]
}

export function WorkspacesPage({ initialWorkspaces }: WorkspacesPageProps) {
  const locale = useLocale() as AppLocale
  const t = useTranslations("dashboardContent.workspaces")
  const sharedT = useTranslations("dashboardContent.shared")
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<"all" | WorkspaceStatus>("all")
  const [framework, setFramework] = React.useState<"all" | WorkspaceFramework>(
    "all"
  )
  const workspaceColumns = useWorkspaceColumns()

  const filteredWorkspaces = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return initialWorkspaces.filter((workspace) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          workspace.name,
          workspace.team,
          workspace.teamEmail,
          workspace.style,
          workspace.framework,
          workspace.releaseChannel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesStatus = status === "all" || workspace.status === status
      const matchesFramework =
        framework === "all" || workspace.framework === framework

      return matchesQuery && matchesStatus && matchesFramework
    })
  }, [framework, initialWorkspaces, query, status])

  const hasActiveFilters =
    query.length > 0 || status !== "all" || framework !== "all"

  const handleResetFilters = React.useCallback(() => {
    setQuery("")
    setStatus("all")
    setFramework("all")
  }, [])

  const emptyState =
    initialWorkspaces.length === 0 ? (
      <EmptyState
        title={t("empty.noneTitle")}
        description={t("empty.noneDescription")}
        action={
          <Button asChild variant="outline">
            <Link href={localizePathname("/dashboard", locale)}>
              {sharedT("returnToOverview")}
            </Link>
          </Button>
        }
      />
    ) : (
      <EmptyState
        title={t("empty.filteredTitle")}
        description={t("empty.filteredDescription")}
        action={
          <Button variant="outline" onClick={handleResetFilters}>
            {sharedT("resetFilters")}
          </Button>
        }
      />
    )

  return (
    <DashboardPage
      title={t("title")}
      description={t("description")}
      actions={
        <>
          <Button variant="outline">
            <Download />
            {t("actions.exportInventory")}
          </Button>
          <Button>
            <Plus />
            {t("actions.createWorkspace")}
          </Button>
        </>
      }
    >
      <PageSection
        title={t("sections.healthTitle")}
        description={t("sections.healthDescription")}
      >
        <WorkspaceSummaryCards workspaces={filteredWorkspaces} />
      </PageSection>

      <TableSection
        title={t("sections.inventoryTitle")}
        description={t("sections.inventoryDescription")}
        columns={workspaceColumns}
        data={filteredWorkspaces}
        pageSize={6}
        filterBar={
          <WorkspaceListFilters
            query={query}
            status={status}
            framework={framework}
            resultCount={filteredWorkspaces.length}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onFrameworkChange={setFramework}
            onReset={handleResetFilters}
          />
        }
        emptyState={emptyState}
        actions={
          hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              {sharedT("resetView")}
            </Button>
          ) : null
        }
      />
    </DashboardPage>
  )
}
