"use client"

import * as React from "react"
import {
  coerceAdoptionCompare,
  coerceAdoptionRange,
  getAdoptionChannelChartConfig,
  getAdoptionChartConfig,
  mapAdoptionOverviewPayloadToDataset,
  parseAdoptionOverviewPayload,
  type AdoptionCompare,
  type AdoptionOverviewPayload,
  type AdoptionRange,
} from "@/features/adoption/adoption-overview-data"
import { AdoptionOverviewFilters } from "@/features/adoption/adoption-overview-filters"
import { AdoptionOverviewSummaryCards } from "@/features/adoption/adoption-overview-summary-cards"
import { Download, Share2 } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import { getMockAdoptionPayload } from "@/lib/mock-data/adoption"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export interface AdoptionOverviewPageProps {
  initialCompare: AdoptionCompare
  initialPayload: AdoptionOverviewPayload
  initialRange: AdoptionRange
}

export function AdoptionOverviewPage({
  initialCompare,
  initialPayload,
  initialRange,
}: AdoptionOverviewPageProps) {
  const locale = useLocale()
  const t = useTranslations("dashboardContent.adoption")
  const [range, setRange] = React.useState(initialRange)
  const [compare, setCompare] = React.useState(initialCompare)
  const [payload, setPayload] = React.useState(initialPayload)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isRefreshing, startTransition] = React.useTransition()

  const dataset = React.useMemo(() => {
    return mapAdoptionOverviewPayloadToDataset(payload, locale, (key, values) =>
      t(key, values)
    )
  }, [locale, payload, t])

  const adoptionChartConfig = React.useMemo(
    () => getAdoptionChartConfig((key) => t(key)),
    [t]
  )
  const adoptionChannelChartConfig = React.useMemo(
    () => getAdoptionChannelChartConfig((key) => t(key)),
    [t]
  )

  const requestPayload = React.useCallback(
    (nextRange: AdoptionRange, nextCompare: AdoptionCompare) => {
      setErrorMessage(null)

      startTransition(async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 150))
          const nextPayload = parseAdoptionOverviewPayload(
            getMockAdoptionPayload(nextRange, nextCompare)
          )
          setPayload(nextPayload)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : t("alert.refreshFailed")
          )
        }
      })
    },
    [t]
  )

  const handleRangeChange = React.useCallback(
    (nextRange: AdoptionRange) => {
      const normalizedRange = coerceAdoptionRange(nextRange)
      setRange(normalizedRange)
      requestPayload(normalizedRange, compare)
    },
    [compare, requestPayload]
  )

  const handleCompareChange = React.useCallback(
    (nextCompare: AdoptionCompare) => {
      const normalizedCompare = coerceAdoptionCompare(nextCompare)
      setCompare(normalizedCompare)
      requestPayload(range, normalizedCompare)
    },
    [range, requestPayload]
  )

  const hasTrendData = dataset.trendSeries.length > 0
  const hasChannelData = dataset.channelSeries.length > 0
  const hasInsightData = dataset.insights.length > 0

  return (
    <DashboardPage
      title={t("title")}
      description={t("description")}
      actions={
        <>
          <Button variant="outline">
            <Share2 />
            {t("actions.shareReport")}
          </Button>
          <Button>
            <Download />
            {t("actions.exportCsv")}
          </Button>
        </>
      }
    >
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertTitle>{t("alert.refreshFailed")}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <AdoptionOverviewFilters
        range={range}
        compare={compare}
        isRefreshing={isRefreshing}
        onRangeChange={handleRangeChange}
        onCompareChange={handleCompareChange}
      />

      <PageSection
        title={t("sections.snapshotTitle")}
        description={t("sections.snapshotDescription")}
      >
        <AdoptionOverviewSummaryCards dataset={dataset} />
      </PageSection>

      <PageSection
        title={t("sections.reportingTitle")}
        description={t("sections.reportingDescription")}
        contentClassName="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]"
      >
        <ChartCard
          title={t("cards.installsAndPreviews")}
          description={t("cards.installsAndPreviewsDescription")}
          hasData={hasTrendData}
          emptyState={
            <EmptyState
              title={t("cards.noTrendTitle")}
              description={t("cards.noTrendDescription")}
            />
          }
          footer={
            <p className="text-sm text-muted-foreground">
              {compare === "previous"
                ? t("cards.comparePrevious")
                : t("cards.compareYear")}
            </p>
          }
        >
          <ChartContainer
            config={adoptionChartConfig}
            className="h-[260px] w-full"
          >
            <AreaChart
              data={dataset.trendSeries}
              margin={{ left: 6, right: 6 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="installs"
                type="monotone"
                fill="var(--color-installs)"
                fillOpacity={0.16}
                stroke="var(--color-installs)"
                strokeWidth={2}
              />
              <Area
                dataKey="previews"
                type="monotone"
                fill="var(--color-previews)"
                fillOpacity={0.1}
                stroke="var(--color-previews)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title={t("cards.bySurface")}
          description={t("cards.bySurfaceDescription")}
          hasData={hasChannelData}
          emptyState={
            <EmptyState
              title={t("cards.noBreakdownTitle")}
              description={t("cards.noBreakdownDescription")}
            />
          }
          footer={
            <p className="text-sm text-muted-foreground">
              {t("cards.relativeUsage")}
            </p>
          }
        >
          <ChartContainer
            config={adoptionChannelChartConfig}
            className="h-[260px] w-full"
          >
            <BarChart
              data={dataset.channelSeries}
              layout="vertical"
              margin={{ left: 0, right: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="source"
                tickLine={false}
                axisLine={false}
                width={86}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="usage" fill="var(--color-usage)" radius={6} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </PageSection>

      <PageSection
        title={t("sections.signalsTitle")}
        description={t("sections.signalsDescription")}
      >
        {hasInsightData ? (
          <SectionCard
            title={t("cards.readout")}
            description={t("cards.readoutDescription")}
          >
            <div className="divide-y">
              {dataset.insights.map((insight) => (
                <div
                  key={insight.label}
                  className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[1.2fr_auto_1fr] md:items-center"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{insight.label}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {insight.value}
                  </p>
                  <p className="text-sm text-muted-foreground md:text-right">
                    {insight.delta}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title={t("cards.readout")}>
            <EmptyState
              title={t("cards.noInsightsTitle")}
              description={t("cards.noInsightsDescription")}
            />
          </SectionCard>
        )}
      </PageSection>
    </DashboardPage>
  )
}
