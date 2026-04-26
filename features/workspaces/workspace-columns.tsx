"use client"

import * as React from "react"
import {
  getWorkspaceFrameworkKey,
  getWorkspaceReleaseChannelKey,
  type WorkspaceRecord,
} from "@/features/workspaces/workspace-data"
import { WorkspaceStatusBadge } from "@/features/workspaces/workspace-status-badge"
import { type ColumnDef } from "@tanstack/react-table"

import { useLocale, useTranslations } from "@/lib/i18n/client"
export function useWorkspaceColumns(): ColumnDef<WorkspaceRecord>[] {
  const locale = useLocale()
  const t = useTranslations("dashboardContent.workspaces")
  const compactNumberFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [locale]
  )

  return React.useMemo<ColumnDef<WorkspaceRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("columns.workspace"),
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {t(
                `frameworks.${getWorkspaceFrameworkKey(row.original.framework)}`
              )}{" "}
              ·{" "}
              {t("columns.components", {
                count: row.original.installedComponents,
              })}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "team",
        header: t("columns.team"),
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.team}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.teamEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "style",
        header: t("columns.registry"),
        cell: ({ row }) => (
          <div className="space-y-1">
            <p>{row.original.style}</p>
            <p className="text-xs text-muted-foreground">
              {t("columns.channel", {
                channel: t(
                  `releaseChannels.${getWorkspaceReleaseChannelKey(
                    row.original.releaseChannel
                  )}`
                ),
              })}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) => (
          <WorkspaceStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "lastReleaseLabel",
        header: t("columns.lastRelease"),
        cell: ({ row }) => (
          <div className="space-y-1">
            <p>{row.original.lastReleaseLabel}</p>
            <p className="text-xs text-muted-foreground">
              {t("columns.installPulls", {
                count: compactNumberFormatter.format(
                  row.original.monthlyInstalls
                ),
              })}
            </p>
          </div>
        ),
      },
    ],
    [compactNumberFormatter, t]
  )
}
