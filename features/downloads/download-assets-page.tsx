"use client"

import * as React from "react"
import { Download, ExternalLink, Laptop, ShieldCheck, Smartphone } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

type DownloadPlatform = "all" | "android" | "ios" | "macos" | "windows" | "linux"

interface DownloadAppRecord {
  id: string
  platform: Exclude<DownloadPlatform, "all">
  name: string
  pricing: string
  source: string
  protocols: string[]
  bestFor: { en: string; fa: string }
  reason: { en: string; fa: string }
  compatibility: { en: string; fa: string }
  downloadUrl: string
  officialSiteUrl: string
  guideSteps: { en: string; fa: string }[]
  disabledReason?: { en: string; fa: string }
}

const platformMeta: Array<{
  value: DownloadPlatform
  label: { en: string; fa: string }
}> = [
  { value: "all", label: { en: "All", fa: "همه" } },
  { value: "android", label: { en: "Android", fa: "اندروید" } },
  { value: "ios", label: { en: "iPhone/iPad", fa: "آیفون/آیپد" } },
  { value: "macos", label: { en: "macOS", fa: "مک" } },
  { value: "windows", label: { en: "Windows", fa: "ویندوز" } },
  { value: "linux", label: { en: "Linux", fa: "لینوکس" } },
] as const

const downloadApps: DownloadAppRecord[] = [
  {
    id: "android-v2rayng",
    platform: "android",
    name: "V2RayNG",
    pricing: "Free",
    source: "Play Store",
    protocols: ["VMess", "VLESS", "Trojan"],
    bestFor: { en: "Best for most Android users", fa: "مناسب بیشتر کاربران اندروید" },
    reason: { en: "Simple clipboard and QR import flow", fa: "ورود ساده با کلیپ‌بورد و QR" },
    compatibility: { en: "Works well with most Tunnel configs", fa: "سازگار با بیشتر کانفیگ‌های تونل" },
    downloadUrl: "https://example.com/android-v2rayng",
    officialSiteUrl: "https://example.com/v2rayng",
    guideSteps: [
      { en: "Download and open the app.", fa: "اپ را دانلود و اجرا کنید." },
      { en: "Open your Configs page in Tunnel.", fa: "صفحه کانفیگ‌ها را در تونل باز کنید." },
      { en: "Copy the config link or open the QR code.", fa: "لینک کانفیگ را کپی کنید یا QR را باز کنید." },
      { en: "Import the config inside V2RayNG.", fa: "کانفیگ را داخل V2RayNG وارد کنید." },
    ],
  },
  {
    id: "ios-shadowrocket",
    platform: "ios",
    name: "Shadowrocket",
    pricing: "Paid",
    source: "App Store",
    protocols: ["VMess", "VLESS", "Trojan"],
    bestFor: { en: "Best iOS compatibility", fa: "بهترین سازگاری برای iOS" },
    reason: { en: "Reliable import flow on iPhone and iPad", fa: "فرآیند ورود قابل اعتماد روی آیفون و آیپد" },
    compatibility: { en: "Great for QR and clipboard setup", fa: "مناسب برای راه‌اندازی با QR و کلیپ‌بورد" },
    downloadUrl: "https://example.com/ios-shadowrocket",
    officialSiteUrl: "https://example.com/shadowrocket",
    guideSteps: [
      { en: "Install Shadowrocket from the App Store.", fa: "Shadowrocket را از اپ استور نصب کنید." },
      { en: "Return to Tunnel and copy your config link.", fa: "به تونل برگردید و لینک کانفیگ را کپی کنید." },
      { en: "Open Shadowrocket and add from clipboard.", fa: "Shadowrocket را باز کنید و از کلیپ‌بورد اضافه کنید." },
    ],
  },
  {
    id: "macos-nekoray",
    platform: "macos",
    name: "Nekoray",
    pricing: "Open Source",
    source: "GitHub",
    protocols: ["VMess", "VLESS", "Trojan"],
    bestFor: { en: "Best for most desktop users", fa: "مناسب بیشتر کاربران دسکتاپ" },
    reason: { en: "Strong desktop support and clear import flow", fa: "پشتیبانی خوب دسکتاپ و ورود ساده" },
    compatibility: { en: "Good for macOS with modern protocols", fa: "مناسب macOS با پروتکل‌های جدید" },
    downloadUrl: "https://example.com/macos-nekoray",
    officialSiteUrl: "https://example.com/nekoray",
    guideSteps: [
      { en: "Download the latest stable release.", fa: "آخرین نسخه پایدار را دانلود کنید." },
      { en: "Open the app and create a new profile.", fa: "اپ را باز کنید و پروفایل جدید بسازید." },
      { en: "Paste your Tunnel config link into the import flow.", fa: "لینک کانفیگ تونل را در بخش ورود قرار دهید." },
    ],
  },
  {
    id: "windows-nekoray",
    platform: "windows",
    name: "Nekoray",
    pricing: "Open Source",
    source: "GitHub",
    protocols: ["VMess", "VLESS", "Trojan"],
    bestFor: { en: "Stable default for Windows", fa: "گزینه پایدار برای ویندوز" },
    reason: { en: "Easy setup for most Windows users", fa: "راه‌اندازی ساده برای بیشتر کاربران ویندوز" },
    compatibility: { en: "Works with all main Tunnel protocols", fa: "سازگار با همه پروتکل‌های اصلی تونل" },
    downloadUrl: "https://example.com/windows-nekoray",
    officialSiteUrl: "https://example.com/nekoray-windows",
    guideSteps: [
      { en: "Download the latest release archive.", fa: "آخرین بسته را دانلود کنید." },
      { en: "Extract and open the app.", fa: "فایل را استخراج و اپ را باز کنید." },
      { en: "Import your copied config URL.", fa: "آدرس کانفیگ کپی‌شده را وارد کنید." },
    ],
  },
  {
    id: "linux-clash-verge",
    platform: "linux",
    name: "Clash Verge",
    pricing: "Open Source",
    source: "GitHub",
    protocols: ["VMess", "VLESS", "Trojan"],
    bestFor: { en: "Alternative for advanced users", fa: "جایگزین برای کاربران حرفه‌ای" },
    reason: { en: "Good option if you prefer a different desktop UX", fa: "گزینه مناسب اگر UX دیگری می‌خواهید" },
    compatibility: { en: "Useful for Linux desktop setups", fa: "مناسب برای راه‌اندازی روی لینوکس دسکتاپ" },
    downloadUrl: "https://example.com/linux-clash-verge",
    officialSiteUrl: "https://example.com/clash-verge",
    guideSteps: [
      { en: "Download the Linux build.", fa: "نسخه لینوکس را دانلود کنید." },
      { en: "Open the app and create or import a profile.", fa: "اپ را باز کرده و پروفایل جدید بسازید یا وارد کنید." },
      { en: "Paste the Tunnel config into the app.", fa: "کانفیگ تونل را داخل اپ وارد کنید." },
    ],
    disabledReason: { en: "Linux builds may vary by distro in this demo.", fa: "در این دمو، نسخه‌های لینوکس بسته به توزیع متفاوت‌اند." },
  },
]

export function DownloadAssetsPage() {
  const { direction, locale } = useLocaleContext()
  const { addToast } = useUiState()
  const [platformFilter, setPlatformFilter] = React.useState<DownloadPlatform>("all")
  const [selectedGuideId, setSelectedGuideId] = React.useState<string | null>(null)

  const filteredApps = React.useMemo(() => {
    if (platformFilter === "all") {
      return downloadApps
    }

    return downloadApps.filter((app) => app.platform === platformFilter)
  }, [platformFilter])

  const recommendedApps = React.useMemo(() => {
    if (platformFilter === "all") {
      return downloadApps.filter((app) => ["android", "macos"].includes(app.platform))
    }

    return downloadApps.filter((app) => app.platform === platformFilter).slice(0, 2)
  }, [platformFilter])

  const selectedGuide =
    downloadApps.find((app) => app.id === selectedGuideId) ?? null

  const openExternalPlaceholder = React.useCallback(
    (label: string) => {
      addToast(
        locale === "fa"
          ? `${label} در این دمو به‌صورت نمایشی باز می‌شود.`
          : `${label} opens as a demo external link in this build.`,
        "default"
      )
    },
    [addToast, locale]
  )

  return (
    <DashboardPage
      title={locale === "fa" ? "دانلود اپ‌ها" : "Download Apps"}
      description={
        locale === "fa"
          ? "اپ مناسب دستگاه خود را انتخاب کنید و سپس کانفیگ تونل را وارد کنید."
          : "Choose the right client for your device, then import your Tunnel config."
      }
    >
      <PageSection
        title={locale === "fa" ? "پلتفرم‌ها" : "Platforms"}
        description={
          locale === "fa"
            ? "اپ مناسب برای اندروید، iPhone/iPad، مک، ویندوز و لینوکس را پیدا کنید."
            : "Find the right app for Android, iPhone/iPad, macOS, Windows, and Linux."
        }
      >
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-2 pb-1">
            {platformMeta.map((platform) => {
              const isActive = platform.value === platformFilter

              return (
                <Button
                  key={platform.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setPlatformFilter(platform.value)}
                >
                  {platform.label[locale]}
                </Button>
              )
            })}
          </div>
        </div>
      </PageSection>

      <PageSection
        title={locale === "fa" ? "پیشنهاد برای شما" : "Recommended for you"}
        description={
          locale === "fa"
            ? "برای شروع سریع، این اپ‌ها بهترین انتخاب هستند."
            : "These are the fastest options for getting started."
        }
        contentClassName="grid gap-4 xl:grid-cols-2"
      >
        {recommendedApps.map((app) => (
          <SectionCard
            key={app.id}
            title={app.name}
            description={platformMeta.find((platform) => platform.value === app.platform)?.label[locale]}
            actions={
              <Badge variant="secondary">{app.pricing}</Badge>
            }
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {app.platform === "android" || app.platform === "ios" ? (
                    <Smartphone className="size-5" />
                  ) : (
                    <Laptop className="size-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{app.bestFor[locale]}</p>
                  <p className="text-sm text-muted-foreground">{app.reason[locale]}</p>
                  <p className="text-xs text-muted-foreground">{app.compatibility[locale]}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {app.protocols.map((protocol) => (
                  <Badge key={protocol} variant="outline">
                    {protocol}
                  </Badge>
                ))}
                <Badge variant="outline">{app.source}</Badge>
              </div>

              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => openExternalPlaceholder(app.name)}
                >
                  <Download className="size-4" />
                  {locale === "fa" ? "دانلود اپ" : "Download App"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setSelectedGuideId(app.id)}
                >
                  <ShieldCheck className="size-4" />
                  {locale === "fa" ? "راهنما" : "Guide"}
                </Button>
              </div>
            </div>
          </SectionCard>
        ))}
      </PageSection>

      <PageSection
        title={locale === "fa" ? "همه اپ‌ها" : "All apps"}
        description={
          locale === "fa"
            ? "اپ‌ها را بر اساس سیستم‌عامل بررسی و انتخاب کنید."
            : "Browse each app by platform and choose the best fit."
        }
      >
        {filteredApps.length === 0 ? (
          <EmptyState
            title={locale === "fa" ? "اپی برای این فیلتر پیدا نشد" : "No apps match this filter"}
            description={
              locale === "fa"
                ? "فیلتر دیگری را امتحان کنید یا نمایش همه را انتخاب کنید."
                : "Try another platform or switch back to all apps."
            }
            action={
              <Button variant="outline" onClick={() => setPlatformFilter("all")}>
                {locale === "fa" ? "نمایش همه" : "Show all"}
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredApps.map((app) => (
              <SectionCard
                key={app.id}
                title={app.name}
                description={platformMeta.find((platform) => platform.value === app.platform)?.label[locale]}
                actions={<Badge variant="outline">{app.pricing}</Badge>}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{app.source}</Badge>
                    {app.protocols.map((protocol) => (
                      <Badge key={protocol} variant="outline">
                        {protocol}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{app.bestFor[locale]}</p>
                    <p className="text-sm text-muted-foreground">{app.reason[locale]}</p>
                  </div>

                  {app.disabledReason ? (
                    <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      {app.disabledReason[locale]}
                    </div>
                  ) : null}

                  <div className="grid gap-2 sm:flex sm:flex-wrap">
                    <Button
                      type="button"
                      className="w-full sm:w-auto"
                      disabled={Boolean(app.disabledReason)}
                      onClick={() => openExternalPlaceholder(app.name)}
                    >
                      <Download className="size-4" />
                      {locale === "fa" ? "دانلود" : "Download"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedGuideId(app.id)}
                    >
                      <ShieldCheck className="size-4" />
                      {locale === "fa" ? "راهنما" : "Guide"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full sm:w-auto"
                      onClick={() => openExternalPlaceholder(app.name)}
                    >
                      <ExternalLink className="size-4" />
                      {locale === "fa" ? "سایت رسمی" : "Official Site"}
                    </Button>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        title={locale === "fa" ? "جمع‌بندی سازگاری" : "Compatibility summary"}
        description={
          locale === "fa"
            ? "انتخاب سریع اپ پیشنهادی برای هر سیستم‌عامل."
            : "A quick view of the best default app for each platform."
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {downloadApps.slice(0, 5).map((app) => (
            <div key={`${app.id}-summary`} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                {platformMeta.find((platform) => platform.value === app.platform)?.label[locale]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{app.name}</p>
              <p className="mt-2 text-xs text-muted-foreground">{app.bestFor[locale]}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {selectedGuide ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setSelectedGuideId(null)}
          />
          <div
            className={cn(
              "fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 max-h-[min(82svh,42rem)] overflow-y-auto rounded-3xl border bg-background p-4 shadow-2xl sm:inset-x-6 sm:p-5 md:inset-auto md:top-1/2 md:max-h-none md:w-[440px] md:-translate-y-1/2 md:p-6",
              direction === "rtl" ? "md:right-1/2 md:translate-x-1/2" : "md:left-1/2 md:-translate-x-1/2"
            )}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">
                  {platformMeta.find((platform) => platform.value === selectedGuide.platform)?.label[locale]}
                </Badge>
                <div>
                  <h3 className="text-lg font-semibold">
                    {locale === "fa" ? `راهنمای نصب — ${selectedGuide.name}` : `Install Guide — ${selectedGuide.name}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedGuide.compatibility[locale]}</p>
                </div>
              </div>

              <ol className="space-y-3 text-sm text-muted-foreground">
                {selectedGuide.guideSteps.map((step, index) => (
                  <li key={`${selectedGuide.id}-${index}`} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{step[locale]}</span>
                  </li>
                ))}
              </ol>

              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => openExternalPlaceholder(selectedGuide.name)}
                >
                  <Download className="size-4" />
                  {locale === "fa" ? "باز کردن لینک دانلود" : "Open download link"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setSelectedGuideId(null)}
                >
                  {locale === "fa" ? "بستن" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </DashboardPage>
  )
}