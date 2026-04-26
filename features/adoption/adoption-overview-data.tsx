import type { ReactNode } from "react"
import { Activity, Boxes, RefreshCw, Sparkles } from "lucide-react"
import { z } from "zod"

import type { ChartConfig } from "@/components/ui/chart"

export type AdoptionRange = "30d" | "90d" | "12m"
export type AdoptionCompare = "previous" | "year"

export interface AdoptionSeriesPoint {
  label: string
  installs: number
  previews: number
}

export interface AdoptionChannelPoint {
  source: string
  usage: number
}

export interface AdoptionInsight {
  label: string
  value: string
  delta: string
  description: string
}

export type AdoptionMetricKey =
  | "install_pulls"
  | "active_workspaces"
  | "publish_success"
  | "preview_sessions"

export interface AdoptionMetric {
  key: AdoptionMetricKey
  label: string
  value: string
  trend: string
  meta: string
  icon: ReactNode
}

export interface AdoptionOverviewDataset {
  metrics: AdoptionMetric[]
  trendSeries: AdoptionSeriesPoint[]
  channelSeries: AdoptionChannelPoint[]
  insights: AdoptionInsight[]
}

export function getAdoptionRangeOptions(t: (key: string) => string) {
  return [
    { value: "30d", label: t("filters.last30Days") },
    { value: "90d", label: t("filters.last90Days") },
    { value: "12m", label: t("filters.last12Months") },
  ] satisfies Array<{ value: AdoptionRange; label: string }>
}

export function getAdoptionCompareOptions(t: (key: string) => string) {
  return [
    { value: "previous", label: t("filters.comparePrevious") },
    { value: "year", label: t("filters.compareYear") },
  ] satisfies Array<{ value: AdoptionCompare; label: string }>
}

export function getAdoptionChartConfig(t: (key: string) => string) {
  return {
    installs: {
      label: t("metrics.installPulls"),
      color: "var(--chart-1)",
    },
    previews: {
      label: t("metrics.previewSessions"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
}

export function getAdoptionChannelChartConfig(t: (key: string) => string) {
  return {
    usage: {
      label: t("metrics.usage"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig
}

const adoptionMetricSchema = z.object({
  key: z.enum([
    "install_pulls",
    "active_workspaces",
    "publish_success",
    "preview_sessions",
  ]),
  label: z.string(),
  value: z.number(),
  compareValue: z.number(),
  meta: z.string(),
})

const adoptionSeriesPointSchema = z.object({
  label: z.string(),
  installs: z.number(),
  previews: z.number(),
})

const adoptionChannelPointSchema = z.object({
  source: z.string(),
  usage: z.number(),
})

const adoptionInsightSchema = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string(),
  description: z.string(),
})

export const adoptionOverviewPayloadSchema = z.object({
  metrics: z.array(adoptionMetricSchema),
  trendSeries: z.array(adoptionSeriesPointSchema),
  channelSeries: z.array(adoptionChannelPointSchema),
  insights: z.array(adoptionInsightSchema),
})

export type AdoptionOverviewPayload = z.infer<
  typeof adoptionOverviewPayloadSchema
>

export const emptyAdoptionOverviewPayload: AdoptionOverviewPayload = {
  metrics: [
    {
      key: "install_pulls",
      label: "Install pulls",
      value: 0,
      compareValue: 0,
      meta: "CLI and docs installs",
    },
    {
      key: "active_workspaces",
      label: "Active workspaces",
      value: 0,
      compareValue: 0,
      meta: "Touched the registry this period",
    },
    {
      key: "publish_success",
      label: "Publish success",
      value: 100,
      compareValue: 100,
      meta: "Release and preview jobs",
    },
    {
      key: "preview_sessions",
      label: "Preview sessions",
      value: 0,
      compareValue: 0,
      meta: "Create studio and shared previews",
    },
  ],
  trendSeries: [],
  channelSeries: [],
  insights: [],
}

function formatSignedPercentDelta(
  value: number,
  compareValue: number,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
) {
  const percentFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  if (compareValue === 0) {
    return value === 0 ? t("metrics.noChange") : t("metrics.newActivity")
  }

  const delta = ((value - compareValue) / compareValue) * 100
  return `${delta >= 0 ? "+" : ""}${percentFormatter.format(delta)}%`
}

function formatSignedCountDelta(value: number, compareValue: number) {
  const delta = value - compareValue
  return `${delta >= 0 ? "+" : ""}${delta}`
}

function formatMetricValue(
  metric: AdoptionOverviewPayload["metrics"][number],
  locale: string
) {
  const compactNumberFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  })
  const percentFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  switch (metric.key) {
    case "publish_success":
      return `${percentFormatter.format(metric.value)}%`
    case "active_workspaces":
      return String(Math.round(metric.value))
    default:
      return compactNumberFormatter.format(metric.value)
  }
}

function formatMetricTrend(
  metric: AdoptionOverviewPayload["metrics"][number],
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
) {
  switch (metric.key) {
    case "publish_success":
      return t("metrics.pts", {
        value: formatSignedCountDelta(metric.value, metric.compareValue),
      })
    case "active_workspaces":
      return t("metrics.workspacesDelta", {
        value: formatSignedCountDelta(metric.value, metric.compareValue),
      })
    default:
      return formatSignedPercentDelta(
        metric.value,
        metric.compareValue,
        locale,
        t
      )
  }
}

function getMetricIcon(key: AdoptionMetricKey) {
  switch (key) {
    case "install_pulls":
      return <Activity className="size-4" />
    case "active_workspaces":
      return <Boxes className="size-4" />
    case "publish_success":
      return <RefreshCw className="size-4" />
    case "preview_sessions":
      return <Sparkles className="size-4" />
  }
}

export function parseAdoptionOverviewPayload(
  value: unknown
): AdoptionOverviewPayload {
  const parsed = adoptionOverviewPayloadSchema.safeParse(value)

  return parsed.success ? parsed.data : emptyAdoptionOverviewPayload
}

export function mapAdoptionOverviewPayloadToDataset(
  payload: AdoptionOverviewPayload,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
): AdoptionOverviewDataset {
  return {
    metrics: payload.metrics.map((metric) => ({
      key: metric.key,
      label:
        metric.key === "install_pulls"
          ? t("metrics.installPulls")
          : metric.key === "active_workspaces"
            ? t("metrics.activeWorkspaces")
            : metric.key === "publish_success"
              ? t("metrics.publishSuccess")
              : t("metrics.previewSessions"),
      value: formatMetricValue(metric, locale),
      trend: formatMetricTrend(metric, locale, t),
      meta:
        metric.key === "install_pulls"
          ? t("metrics.installsMeta")
          : metric.key === "active_workspaces"
            ? t("metrics.workspacesMeta")
            : metric.key === "publish_success"
              ? t("metrics.publishMeta")
              : t("metrics.previewsMeta"),
      icon: getMetricIcon(metric.key),
    })),
    trendSeries: payload.trendSeries,
    channelSeries: payload.channelSeries,
    insights: payload.insights,
  }
}

export function coerceAdoptionRange(
  value: string | null | undefined
): AdoptionRange {
  switch (value) {
    case "30d":
    case "12m":
      return value
    default:
      return "90d"
  }
}

export function coerceAdoptionCompare(
  value: string | null | undefined
): AdoptionCompare {
  return value === "year" ? "year" : "previous"
}
