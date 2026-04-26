"use client"

import * as React from "react"
import { Copy, Download, QrCode, ShieldCheck } from "lucide-react"

import { configProfiles } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatDate, formatDateTime } from "@/lib/formatting"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function ConfigsPage() {
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const [selectedConfigId, setSelectedConfigId] = React.useState<string | null>(null)
  const [expandedConfigIds, setExpandedConfigIds] = React.useState<string[]>([])
  const selectedConfig =
    configProfiles.find((config) => config.id === selectedConfigId) ?? null

  const toggleExpandedConfig = React.useCallback((configId: string) => {
    setExpandedConfigIds((current) =>
      current.includes(configId)
        ? current.filter((id) => id !== configId)
        : [...current, configId]
    )
  }, [])

  const copyValue = React.useCallback(
    async (value: string, message: string) => {
      await navigator.clipboard.writeText(value)
      addToast(message, "success")
    },
    [addToast]
  )

  const detailsRows = React.useCallback(
    (config: (typeof configProfiles)[number]) => [
      {
        label: locale === "fa" ? "شناسه اشتراک" : "Subscription ID",
        value: config.subscriptionId,
      },
      {
        label: locale === "fa" ? "وضعیت" : "Status",
        value:
          config.status === "active"
            ? locale === "fa"
              ? "فعال"
              : "Active"
            : config.status === "locked"
              ? locale === "fa"
                ? "قفل شده"
                : "Locked"
              : locale === "fa"
                ? "منقضی"
                : "Expired",
      },
      {
        label: locale === "fa" ? "دانلود شده" : "Downloaded",
        value: config.downloadedLabel,
      },
      {
        label: locale === "fa" ? "آپلود شده" : "Uploaded",
        value: config.uploadedLabel,
      },
      {
        label: locale === "fa" ? "مصرف" : "Usage",
        value: config.usageLabel,
      },
      {
        label: locale === "fa" ? "حجم کل" : "Total quota",
        value: config.totalQuotaLabel,
      },
      {
        label: locale === "fa" ? "باقی‌مانده" : "Remained",
        value: config.remainedLabel,
      },
      {
        label: locale === "fa" ? "آخرین اتصال" : "Last online",
        value: formatDateTime(config.lastOnline, locale),
      },
      {
        label: locale === "fa" ? "انقضا" : "Expiry",
        value: config.expiryLabel,
      },
    ],
    [locale]
  )

  return (
    <DashboardPage
      title={locale === "fa" ? "کانفیگ‌ها" : "Configs"}
      description={
        locale === "fa"
          ? "کانفیگ‌های فعال خود را کپی، دانلود یا با QR دریافت کنید."
          : "Copy, download, or scan your active VPN configuration profiles."
      }
    >
      <PageSection
        title={locale === "fa" ? "پروفایل‌های فعال" : "Active profiles"}
        description={
          locale === "fa"
            ? "هر پروفایل شامل نسخه خام، لینک اشتراک و وضعیت دسترسی است."
            : "Each profile includes raw config content, a shareable URL, and an access state."
        }
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {configProfiles.map((config) => (
            <SectionCard
              key={config.id}
              title={config.name}
              description={`${config.location} · ${config.server}`}
              actions={
                <Badge variant={config.status === "active" ? "secondary" : "outline"}>
                  {config.status}
                </Badge>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{config.protocol}</Badge>
                  <Badge variant="outline">{config.secureTransport}</Badge>
                  {config.status === "active" ? <Badge>{locale === "fa" ? "فعال" : "Ready"}</Badge> : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "آخرین به‌روزرسانی" : "Last updated"}:{" "}
                  {formatDate(config.lastUpdated, locale)}
                </p>
                <div className="grid gap-2 sm:flex sm:flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={config.status !== "active"}
                    onClick={() =>
                      void copyValue(
                        config.configUrl,
                        locale === "fa" ? "لینک کانفیگ کپی شد." : "Config link copied."
                      )
                    }
                  >
                    <Copy className="size-4" />
                    {locale === "fa" ? "کپی لینک" : "Copy link"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={config.status !== "active"}
                    onClick={() =>
                      void copyValue(
                        config.rawConfig,
                        locale === "fa" ? "محتوای خام کپی شد." : "Raw config copied."
                      )
                    }
                  >
                    <Download className="size-4" />
                    {locale === "fa" ? "دانلود / کپی" : "Download / copy"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    disabled={config.status !== "active"}
                    onClick={() => setSelectedConfigId(config.id)}
                  >
                    <QrCode className="size-4" />
                    QR
                  </Button>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {locale === "fa" ? "جزئیات فنی" : "Technical details"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === "fa"
                          ? "لینک و محتوای خام را فقط در صورت نیاز باز کنید."
                          : "Expand only when you need the raw link or config content."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => toggleExpandedConfig(config.id)}
                    >
                      {expandedConfigIds.includes(config.id)
                        ? locale === "fa"
                          ? "بستن جزئیات"
                          : "Hide details"
                        : locale === "fa"
                          ? "نمایش جزئیات"
                          : "Show details"}
                    </Button>
                  </div>

                  {expandedConfigIds.includes(config.id) ? (
                    <div className="mt-3 space-y-2.5">
                      <div className="overflow-hidden rounded-xl border bg-background">
                        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,180px)_1fr]" dir={locale === "fa" ? "rtl" : "ltr"}>
                          {detailsRows(config).map((item) => (
                            <React.Fragment key={`${config.id}-${item.label}`}>
                              <div className="border-b px-3 py-2 text-sm text-foreground sm:border-e sm:border-b [&:nth-last-child(2)]:border-b-0">
                                {item.label}
                              </div>
                              <div className="border-b px-3 py-2 text-sm text-muted-foreground last:border-b-0 sm:[&:nth-last-child(1)]:border-b-0">
                                {item.label === (locale === "fa" ? "وضعیت" : "Status") ? (
                                  <Badge variant={config.status === "active" ? "secondary" : "outline"}>
                                    {item.value}
                                  </Badge>
                                ) : (
                                  item.value
                                )}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div
                        className="overflow-x-auto rounded-xl border bg-background px-3 py-2.5 text-[11px] text-muted-foreground sm:text-xs"
                        dir="ltr"
                      >
                        <code className="block whitespace-pre-wrap break-all">
                          {config.rawConfig}
                        </code>
                      </div>
                      <div
                        className="overflow-x-auto rounded-xl border bg-background px-3 py-2.5 text-[11px] sm:text-xs"
                        dir="ltr"
                      >
                        <code className="block break-all">{config.configUrl}</code>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </PageSection>

      {selectedConfig ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setSelectedConfigId(null)}
          />
          <div className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 max-h-[calc(100svh-7rem-env(safe-area-inset-bottom))] overflow-y-auto rounded-3xl border bg-background p-4 shadow-2xl sm:inset-x-6 sm:p-4 md:inset-auto md:left-1/2 md:top-1/2 md:max-h-none md:w-[420px] md:-translate-x-1/2 md:-translate-y-1/2 md:p-5">
            <div className="space-y-3.5 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <QrCode className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedConfig.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa"
                    ? "برای اسکن سریع، این کد نمایشی را روی دستگاه موبایل باز کنید."
                    : "Open this demo QR card on your phone for a one-tap setup flow."}
                </p>
              </div>
              <div className="mx-auto flex aspect-square w-full max-w-52 items-center justify-center rounded-3xl border border-dashed bg-muted/40">
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <div
                      key={index}
                      className={`size-6 rounded-sm ${index % 3 === 0 || index % 5 === 0 ? "bg-foreground" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 text-[11px] sm:text-xs" dir="ltr">
                <code className="block min-w-max break-all">{selectedConfig.configUrl}</code>
              </div>
              <Button className="w-full" onClick={() => setSelectedConfigId(null)}>
                <ShieldCheck className="size-4" />
                {locale === "fa" ? "بستن" : "Close"}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </DashboardPage>
  )
}
