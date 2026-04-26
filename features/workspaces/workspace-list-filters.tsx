"use client"

import {
  workspaceFrameworks,
  workspaceStatuses,
  type WorkspaceFramework,
  type WorkspaceStatus,
} from "@/features/workspaces/workspace-data"

import { useTranslations } from "@/lib/i18n/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilterBar } from "@/components/dashboard/filter-bar"

export interface WorkspaceListFiltersProps {
  query: string
  status: "all" | WorkspaceStatus
  framework: "all" | WorkspaceFramework
  resultCount: number
  onQueryChange: (value: string) => void
  onStatusChange: (value: "all" | WorkspaceStatus) => void
  onFrameworkChange: (value: "all" | WorkspaceFramework) => void
  onReset: () => void
}

export function WorkspaceListFilters({
  query,
  status,
  framework,
  resultCount,
  onQueryChange,
  onStatusChange,
  onFrameworkChange,
  onReset,
}: WorkspaceListFiltersProps) {
  const t = useTranslations("dashboardContent.workspaces")
  const sharedT = useTranslations("dashboardContent.shared")
  const hasActiveFilters =
    query.length > 0 || status !== "all" || framework !== "all"

  return (
    <FilterBar
      actions={
        <>
          <p className="hidden text-sm text-muted-foreground lg:block">
            {t("filters.resultCount", { count: resultCount })}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={onReset}>
              {sharedT("clearFilters")}
            </Button>
          ) : null}
        </>
      }
    >
      <div className="w-full sm:max-w-xs">
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t("filters.searchPlaceholder")}
          aria-label={t("filters.searchAria")}
        />
      </div>
      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(value as "all" | WorkspaceStatus)
        }
      >
        <SelectTrigger className="w-full sm:w-[170px]">
          <SelectValue placeholder={t("filters.statusPlaceholder")} />
        </SelectTrigger>
        <SelectContent align="start">
          {workspaceStatuses.map((item) => (
            <SelectItem key={item} value={item}>
              {item === "all"
                ? t("filters.allStatuses")
                : t(
                    `statuses.${
                      item === "Healthy"
                        ? "healthy"
                        : item === "Syncing"
                          ? "syncing"
                          : "needsReview"
                    }`
                  )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={framework}
        onValueChange={(value) =>
          onFrameworkChange(value as "all" | WorkspaceFramework)
        }
      >
        <SelectTrigger className="w-full sm:w-[170px]">
          <SelectValue placeholder={t("filters.frameworkPlaceholder")} />
        </SelectTrigger>
        <SelectContent align="start">
          {workspaceFrameworks.map((item) => (
            <SelectItem key={item} value={item}>
              {item === "all"
                ? t("filters.allFrameworks")
                : t(
                    `frameworks.${
                      item === "Next.js"
                        ? "nextjs"
                        : item === "Vite"
                          ? "vite"
                          : "monorepo"
                    }`
                  )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  )
}
