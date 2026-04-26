"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Laptop, Monitor, Smartphone, Trash2 } from "lucide-react"

import {
  devices as initialDevices,
  sessionHistory as initialSessions,
  usageBreakdown,
  usageSeries,
  usageSummary,
} from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatDateTime, formatGigabytes } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"
import { StatCard } from "@/components/dashboard/stat-card"

const usageChartConfig = {
  usageGb: {
    label: "Usage",
    color: "var(--color-primary)",
  },
}

type TabKey = "devices" | "sessions" | "usage"

function getDeviceIcon(kind: (typeof initialDevices)[number]["kind"]) {
  switch (kind) {
    case "phone":
      return Smartphone
    case "laptop":
      return Laptop
    default:
      return Monitor
  }
}

export function UsagePage() {
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const [activeTab, setActiveTab] = React.useState<TabKey>("usage")
  const [sessions, setSessions] = React.useState(initialSessions)
  const [deviceRecords, setDeviceRecords] = React.useState(initialDevices)

  return (
    <DashboardPage
      title={locale === "fa" ? "مصرف و وضعیت" : "Usage & status"}
      description={
        locale === "fa"
          ? "مصرف، نشست‌ها و دستگاه‌های فعال خود را در این ماه بررسی کنید."
          : "Review your bandwidth, sessions, and active devices for the current period."
      }
    >
      <PageSection>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label={locale === "fa" ? "مصرف شده" : "Used"}
            value={`${formatGigabytes(usageSummary.usedGb, locale)} GB`}
            trend={locale === "fa" ? "از پلن ماهانه" : "Of your monthly plan"}
          />
          <StatCard
            label={locale === "fa" ? "باقی‌مانده" : "Remaining"}
            value={`${formatGigabytes(usageSummary.remainingGb ?? 0, locale)} GB`}
            trend={`${usageSummary.percentageUsed}%`}
          />
          <StatCard
            label={locale === "fa" ? "نشست‌ها" : "Sessions"}
            value={String(usageSummary.sessionsThisMonth)}
            trend={locale === "fa" ? "این ماه" : "This month"}
          />
        </div>
      </PageSection>

      <PageSection
        title={locale === "fa" ? "مصرف پهنای باند" : "Bandwidth usage"}
        actions={
          <div className="flex flex-wrap gap-2">
            {(["usage", "sessions", "devices"] as TabKey[]).map((tab) => (
              <Button
                key={tab}
                type="button"
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {locale === "fa"
                  ? tab === "usage"
                    ? "مصرف"
                    : tab === "sessions"
                      ? "جلسات"
                      : "دستگاه‌ها"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        }
      >
        <SectionCard
          title={locale === "fa" ? "نمودار روزانه" : "Daily chart"}
          description={
            locale === "fa"
              ? "مصرف روزانه این ماه"
              : "Daily usage for the current month"
          }
        >
          <div className="min-w-0">
            <ChartContainer
              config={usageChartConfig}
              className="h-72 w-full min-w-0 aspect-auto"
              initialDimension={{ width: 640, height: 288 }}
            >
              <BarChart data={usageSeries}>
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usageGb" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </SectionCard>

        {activeTab === "usage" ? (
          <SectionCard
            title={locale === "fa" ? "تفکیک مصرف" : "Usage breakdown"}
            description={
              locale === "fa"
                ? "آپلود، دانلود و سربار مصرف"
                : "Upload, download, and overhead split"
            }
          >
            <div className="space-y-4 text-sm">
              {[
                {
                  label: locale === "fa" ? "آپلود" : "Upload",
                  value: usageBreakdown.uploadGb,
                },
                {
                  label: locale === "fa" ? "دانلود" : "Download",
                  value: usageBreakdown.downloadGb,
                },
                {
                  label: locale === "fa" ? "سربار" : "Overhead",
                  value: usageBreakdown.overheadGb,
                },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span>{formatGigabytes(item.value, locale)} GB</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(item.value / usageSummary.usedGb) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "sessions" ? (
          <SectionCard title={locale === "fa" ? "تاریخچه جلسات" : "Session history"}>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex flex-col gap-3 rounded-xl border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">{session.location}</p>
                    <p className="text-muted-foreground">
                      {formatDateTime(session.startedAt, locale)}
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    ↑ {session.uploadGb} GB · ↓ {session.downloadGb} GB · {session.durationLabel}
                  </div>
                  {session.active ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSessions((current) =>
                          current.map((item) =>
                            item.id === session.id ? { ...item, active: false } : item
                          )
                        )
                        addToast(locale === "fa" ? "جلسه قطع شد." : "Session disconnected.", "success")
                      }}
                    >
                      <Trash2 className="size-4" />
                      {locale === "fa" ? "قطع" : "Terminate"}
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "devices" ? (
          <SectionCard title={locale === "fa" ? "دستگاه‌ها" : "Devices"}>
            <div className="space-y-3">
              {deviceRecords.map((device) => {
                const Icon = getDeviceIcon(device.kind)

                return (
                  <div key={device.id} className="flex flex-col gap-3 rounded-xl border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{device.name}</p>
                        <p className="break-words text-muted-foreground">
                          {device.location} · {device.protocol} · {device.lastSeen}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeviceRecords((current) =>
                          current.filter((item) => item.id !== device.id)
                        )
                        addToast(locale === "fa" ? "دستگاه حذف شد." : "Device revoked.", "success")
                      }}
                    >
                      <Trash2 className="size-4" />
                      {locale === "fa" ? "حذف" : "Revoke"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        ) : null}
      </PageSection>
    </DashboardPage>
  )
}
