"use client"

import Link from "next/link"
import * as React from "react"
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  Clock3,
  RefreshCcw,
  Shield,
  TriangleAlert,
  Wifi,
} from "lucide-react"

import { recentActivity, subscriptionSummary, usageSummary } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatDate, formatDateTime, formatGigabytes, formatNumber } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import type { RecentActivityRecord, SubscriptionSummary, UsageSummary } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export type OverviewDemoState =
  | "default"
  | "loading"
  | "error"
  | "expiring"
  | "expired"
  | "no-plan"
  | "high-usage"
  | "critical-usage"
  | "unlimited"
  | "empty-activity"

export function parseOverviewDemoState(value: string | undefined): OverviewDemoState {
  switch (value) {
    case "loading":
    case "error":
    case "expiring":
    case "expired":
    case "no-plan":
    case "high-usage":
    case "critical-usage":
    case "unlimited":
    case "empty-activity":
      return value
    default:
      return "default"
  }
}

type ExpiryState = "active" | "expiring" | "expired" | "none"
type UsageTone = "default" | "warning" | "critical" | "unlimited"
type OverviewAction = "browse-plans" | "get-config" | "renew-plan"

interface OverviewViewModel {
  activity: RecentActivityRecord[]
  error: boolean
  expiryState: ExpiryState
  loading: boolean
  primaryAction: OverviewAction
  subscription: SubscriptionSummary
  usage: UsageSummary
  usageTone: UsageTone
}

const copy = {
  en: {
    active: "Active",
    activityEmpty: "No recent activity yet.",
    activityHint: "Latest connection events across your VPN devices",
    browsePlans: "Browse plans",
    daysAgo: "days ago",
    daysLeft: "days left",
    emptyPlanDescription: "Get started by choosing a plan and generating your first config.",
    emptyPlanTitle: "No active plan",
    expires: "Expires",
    getConfig: "Get config",
    helperActive: "Your subscription is healthy and ready to use.",
    helperCritical: "You are close to the quota limit. Upgrade or renew soon to avoid interruptions.",
    helperExpired: "Your subscription has expired. Renew now to restore configs and access.",
    helperExpiring: "Your subscription is close to expiry. Renew now to keep configs active.",
    helperNoPlan: "You don't have an active plan yet.",
    helperUnlimited: "Unlimited traffic is enabled. Monitor sessions and keep configs ready.",
    highUsage: "High usage",
    loadingDescription: "Preparing your VPN health summary, usage, and activity.",
    loadingTitle: "Loading overview",
    noPlan: "You don't have an active plan yet.",
    openBilling: "Billing",
    recentActivity: "Recent activity",
    renewPlan: "Renew plan",
    retry: "Try again",
    sessions: "Sessions",
    sessionsThisMonth: "Sessions this month",
    status: "Status",
    title: "Good morning, Sina",
    usage: "Usage",
    usageThisMonth: "Usage this month",
    viewAll: "View all",
    viewUsage: "Usage",
    warningCritical: "Less than 5% of your quota remains.",
    warningExpired: "Your plan has expired. Renew now to resume VPN access.",
    warningExpiring: "Your plan expires soon. Renew now to keep your configs active.",
  },
  fa: {
    active: "فعال",
    activityEmpty: "هنوز فعالیت اخیری ثبت نشده است.",
    activityHint: "آخرین اتصال‌های VPN روی دستگاه‌های شما",
    browsePlans: "مشاهده پلن‌ها",
    daysAgo: "روز گذشته",
    daysLeft: "روز باقی‌مانده",
    emptyPlanDescription: "برای شروع، یک پلن انتخاب کنید و اولین کانفیگ خود را بسازید.",
    emptyPlanTitle: "پلن فعالی ندارید",
    expires: "انقضا",
    getConfig: "دریافت کانفیگ",
    helperActive: "اشتراک شما فعال است و همه چیز برای اتصال آماده است.",
    helperCritical: "به سقف حجم نزدیک شده‌اید. برای جلوگیری از قطع دسترسی، پلن را ارتقا یا تمدید کنید.",
    helperExpired: "اشتراک شما منقضی شده است. برای فعال شدن دوباره کانفیگ‌ها آن را تمدید کنید.",
    helperExpiring: "اشتراک شما در آستانه انقضا است. برای حفظ کانفیگ‌ها همین حالا تمدید کنید.",
    helperNoPlan: "در حال حاضر پلن فعالی ندارید.",
    helperUnlimited: "ترافیک نامحدود فعال است. فقط نشست‌ها و کانفیگ‌ها را مدیریت کنید.",
    highUsage: "مصرف بالا",
    loadingDescription: "در حال آماده‌سازی خلاصه اشتراک، مصرف و فعالیت‌ها.",
    loadingTitle: "در حال بارگذاری داشبورد",
    noPlan: "در حال حاضر پلن فعالی ندارید.",
    openBilling: "پرداخت",
    recentActivity: "فعالیت اخیر",
    renewPlan: "تمدید پلن",
    retry: "تلاش دوباره",
    sessions: "جلسات",
    sessionsThisMonth: "تعداد جلسات این ماه",
    status: "وضعیت",
    title: "صبح بخیر، سینا",
    usage: "مصرف",
    usageThisMonth: "مصرف این ماه",
    viewAll: "مشاهده همه",
    viewUsage: "مصرف",
    warningCritical: "کمتر از ۵٪ از حجم شما باقی مانده است.",
    warningExpired: "پلن شما منقضی شده است. برای بازگشت دسترسی آن را تمدید کنید.",
    warningExpiring: "پلن شما به‌زودی منقضی می‌شود. برای حفظ کانفیگ‌ها همین حالا تمدید کنید.",
  },
} as const

function buildOverviewViewModel(state: OverviewDemoState): OverviewViewModel {
  const subscription: SubscriptionSummary = { ...subscriptionSummary }
  const usage: UsageSummary = { ...usageSummary }
  let activity = [...recentActivity]
  let loading = false
  let error = false

  switch (state) {
    case "loading":
      loading = true
      break
    case "error":
      error = true
      break
    case "expiring":
      subscription.status = "expiring"
      subscription.daysRemaining = 5
      subscription.expiresAt = "2026-04-16T12:00:00.000Z"
      break
    case "expired":
      subscription.status = "expired"
      subscription.daysRemaining = 0
      subscription.expiresAt = "2026-04-08T12:00:00.000Z"
      break
    case "no-plan":
      subscription.status = "none"
      subscription.daysRemaining = null
      subscription.expiresAt = null
      subscription.planName = "Free"
      subscription.totalGb = null
      subscription.usedGb = 0
      usage.percentageUsed = 0
      usage.remainingGb = null
      usage.totalGb = null
      usage.sessionsThisMonth = 0
      usage.unlimited = false
      usage.usedGb = 0
      activity = []
      break
    case "high-usage":
      usage.percentageUsed = 84
      usage.remainingGb = 16
      usage.usedGb = 84
      subscription.usedGb = 84
      break
    case "critical-usage":
      usage.percentageUsed = 97
      usage.remainingGb = 3
      usage.usedGb = 97
      subscription.usedGb = 97
      break
    case "unlimited":
      subscription.planName = "VIP"
      subscription.totalGb = null
      subscription.usedGb = 128.4
      usage.percentageUsed = 0
      usage.remainingGb = null
      usage.totalGb = null
      usage.unlimited = true
      usage.usedGb = 128.4
      break
    case "empty-activity":
      activity = []
      break
    default:
      break
  }

  const expiryState: ExpiryState =
    subscription.status === "none"
      ? "none"
      : subscription.status === "expired" ||
          (subscription.daysRemaining !== null && subscription.daysRemaining <= 0)
        ? "expired"
        : subscription.status === "expiring" ||
            (subscription.daysRemaining !== null && subscription.daysRemaining <= 7)
          ? "expiring"
          : "active"

  const usageTone: UsageTone = usage.unlimited
    ? "unlimited"
    : usage.percentageUsed >= 95
      ? "critical"
      : usage.percentageUsed >= 80
        ? "warning"
        : "default"

  const primaryAction: OverviewAction =
    expiryState === "none"
      ? "browse-plans"
      : expiryState === "expired" || expiryState === "expiring"
        ? "renew-plan"
        : "get-config"

  return {
    activity,
    error,
    expiryState,
    loading,
    primaryAction,
    subscription,
    usage,
    usageTone,
  }
}

function getProgressToneClass(tone: UsageTone) {
  switch (tone) {
    case "critical":
      return "bg-destructive"
    case "warning":
      return "bg-amber-500"
    default:
      return "bg-primary"
  }
}

function getSummaryToneClasses(expiryState: ExpiryState) {
  switch (expiryState) {
    case "expired":
      return "border-destructive/40 bg-destructive/5"
    case "expiring":
      return "border-amber-300/70 bg-amber-50/80 dark:bg-amber-500/10"
    default:
      return ""
  }
}

function OverviewSkeleton() {
  return (
    <DashboardPage title={copy.fa.loadingTitle} description={copy.fa.loadingDescription}>
      <PageSection>
        <div className="dashboard-motion-enter rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_280px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </PageSection>

      <PageSection>
        <SectionCard>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}

export function DashboardOverviewPage({
  demoState = "default",
}: {
  demoState?: OverviewDemoState
}) {
  const { locale } = useLocaleContext()
  const text = copy[locale]
  const overview = React.useMemo(() => buildOverviewViewModel(demoState), [demoState])

  if (overview.loading) {
    return <OverviewSkeleton />
  }

  if (overview.subscription.status === "none") {
    return (
      <DashboardPage title={text.title} description={text.helperNoPlan}>
        <EmptyState
          title={text.emptyPlanTitle}
          description={text.emptyPlanDescription}
          action={
            <Button asChild>
              <Link href={localizePathname("/dashboard/billing/plans", locale)}>
                {text.browsePlans}
              </Link>
            </Button>
          }
        />
      </DashboardPage>
    )
  }

  const { activity, error, expiryState, primaryAction, subscription, usage, usageTone } = overview
  const isWarningState =
    expiryState === "expired" ||
    expiryState === "expiring" ||
    usageTone === "warning" ||
    usageTone === "critical"
  const helperText =
    expiryState === "expired"
      ? text.helperExpired
      : expiryState === "expiring"
        ? text.helperExpiring
        : usageTone === "critical"
          ? text.helperCritical
          : usageTone === "unlimited"
            ? text.helperUnlimited
            : text.helperActive

  const primaryActionHref =
    primaryAction === "renew-plan" || primaryAction === "browse-plans"
      ? "/dashboard/billing/plans"
      : "/dashboard/configs"
  const primaryActionLabel =
    primaryAction === "renew-plan"
      ? text.renewPlan
      : primaryAction === "browse-plans"
        ? text.browsePlans
        : text.getConfig

  const statusLabel =
    expiryState === "expired"
      ? locale === "fa"
        ? "منقضی شده"
        : "Expired"
      : expiryState === "expiring"
        ? locale === "fa"
          ? "رو به انقضا"
          : "Expiring soon"
        : text.active
  const statusToneClass =
    expiryState === "expired"
      ? "bg-destructive text-white"
      : expiryState === "expiring"
        ? "bg-amber-500 text-amber-950"
        : "bg-emerald-500 text-white"

  const usageLabel = usage.unlimited
    ? locale === "fa"
      ? `${formatGigabytes(usage.usedGb, locale)} گیگابایت`
      : `${formatGigabytes(usage.usedGb, locale)} GB`
    : `${formatGigabytes(usage.usedGb, locale)} / ${formatGigabytes(usage.totalGb ?? 0, locale)} GB`

  const usageMeta = usage.unlimited
    ? locale === "fa"
      ? "نامحدود"
      : "Unlimited"
    : locale === "fa"
      ? `${formatGigabytes(usage.remainingGb ?? 0, locale)} گیگابایت باقی‌مانده`
      : `${formatGigabytes(usage.remainingGb ?? 0, locale)} GB remaining`

  const expiryHeadline =
    expiryState === "expired"
      ? locale === "fa"
        ? subscription.expiresAt
          ? `${formatDate(subscription.expiresAt, locale)}`
          : "--"
        : subscription.expiresAt
          ? `${formatDate(subscription.expiresAt, locale)}`
          : "--"
      : subscription.daysRemaining !== null
        ? `${formatNumber(subscription.daysRemaining, locale)} ${text.daysLeft}`
        : "--"

  const warningMessage =
    expiryState === "expired"
      ? text.warningExpired
      : usageTone === "critical"
        ? text.warningCritical
        : text.warningExpiring
  const summaryToneClass = getSummaryToneClasses(expiryState)

  return (
    <DashboardPage
      title={text.title}
      description={
        locale === "fa"
          ? "در یک نگاه وضعیت اشتراک، حجم باقی‌مانده و آخرین اتصال‌های VPN خود را ببینید."
          : "See subscription health, remaining quota, and latest VPN activity at a glance."
      }
    >
      <PageSection>
        {error ? (
          <SectionCard
            title={locale === "fa" ? "بارگذاری داشبورد ناموفق بود" : "Dashboard could not be loaded"}
            description={
              locale === "fa"
                ? "در دریافت خلاصه اشتراک و فعالیت‌ها مشکلی پیش آمده است."
                : "There was a problem loading your subscription and activity summary."
            }
            actions={
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCcw className="size-4" />
                {text.retry}
              </Button>
            }
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TriangleAlert className="size-4 text-destructive" />
              <span>
                {locale === "fa"
                  ? "داده‌های دمو در دسترس نیستند. دوباره تلاش کنید."
                  : "Mock overview data is temporarily unavailable. Please retry."}
              </span>
            </div>
          </SectionCard>
        ) : (
          <SectionCard>
            <div className="space-y-4">
              {isWarningState ? (
                <Alert
                  className={
                    expiryState === "expired"
                      ? "border-destructive/30 bg-destructive/5 text-destructive"
                      : usageTone === "critical"
                        ? "border-destructive/30 bg-destructive/5 text-destructive"
                        : "border-amber-200 bg-amber-50 text-amber-950 dark:bg-amber-500/10 dark:text-amber-200"
                  }
                >
                  <TriangleAlert className="size-4" />
                  <AlertDescription>{warningMessage}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_280px]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusToneClass}>{statusLabel}</Badge>
                    <Badge variant={subscription.planName === "VIP" ? "default" : "secondary"}>
                      {subscription.planName}
                    </Badge>
                    {usageTone === "warning" || usageTone === "critical" ? (
                      <Badge variant="outline">{text.highUsage}</Badge>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {expiryState === "expired"
                        ? locale === "fa"
                          ? "دسترسی شما متوقف شده است"
                          : "Your access is paused"
                        : expiryState === "expiring"
                          ? locale === "fa"
                            ? "اشتراک شما به توجه نیاز دارد"
                            : "Your subscription needs attention"
                          : locale === "fa"
                            ? "همه چیز برای اتصال آماده است"
                            : "Everything is ready to connect"}
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {helperText}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-2xl border px-3.5 py-3 ${summaryToneClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{text.status}</p>
                          <p className="text-lg font-semibold">{statusLabel}</p>
                        </div>
                        <Shield className="size-4 text-muted-foreground" />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {subscription.autoRenew
                          ? locale === "fa"
                            ? "تمدید خودکار فعال است"
                            : "Auto-renew is enabled"
                          : locale === "fa"
                            ? "تمدید خودکار غیرفعال است"
                            : "Auto-renew is off"}
                      </p>
                    </div>

                    <div className="rounded-2xl border px-3.5 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{text.expires}</p>
                          <p className="text-lg font-semibold">{expiryHeadline}</p>
                        </div>
                        <CalendarClock className="size-4 text-muted-foreground" />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {subscription.expiresAt ? formatDate(subscription.expiresAt, locale) : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-primary/6 px-3.5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{text.usageThisMonth}</p>
                        <p className="text-lg font-semibold">{usageLabel}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{usageMeta}</div>
                    </div>

                    {usage.unlimited ? null : (
                      <div className="mt-3 space-y-2">
                        <div
                          className="h-2.5 rounded-full bg-muted"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={usage.percentageUsed}
                          aria-label={text.usage}
                        >
                          <div
                            className={`h-2.5 rounded-full transition-all ${getProgressToneClass(usageTone)}`}
                            style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>{formatNumber(usage.percentageUsed, locale)}%</span>
                          <span>{usageMeta}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5 rounded-2xl border border-primary/15 bg-primary/5 p-3.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    {locale === "fa" ? "اقدام‌های پیشنهادی" : "Recommended actions"}
                  </p>
                  <Button asChild className="w-full justify-between">
                    <Link href={localizePathname(primaryActionHref, locale)}>
                      <span>{primaryActionLabel}</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={localizePathname("/dashboard/usage", locale)}>
                      <span>{text.viewUsage}</span>
                      <Activity className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={localizePathname("/dashboard/billing", locale)}>
                      <span>{text.openBilling}</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        )}
      </PageSection>

      {!error ? (
        <PageSection>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card/95 px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">{text.expires}</p>
              <p className="mt-1 text-xl font-semibold">
                {subscription.daysRemaining !== null ? formatNumber(subscription.daysRemaining, locale) : "--"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{text.daysLeft}</p>
            </div>
            <div className="rounded-2xl border bg-card/95 px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">{text.usage}</p>
              <p className="mt-1 text-xl font-semibold">
                {usage.unlimited ? (locale === "fa" ? "نامحدود" : "Unlimited") : `${formatNumber(usage.percentageUsed, locale)}%`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{text.usageThisMonth}</p>
            </div>
            <div className="rounded-2xl border bg-card/95 px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">{text.sessions}</p>
              <p className="mt-1 text-xl font-semibold">{formatNumber(usage.sessionsThisMonth, locale)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{text.sessionsThisMonth}</p>
            </div>
          </div>
        </PageSection>
      ) : null}

      <PageSection>
        <SectionCard
          title={text.recentActivity}
          description={text.activityHint}
          actions={
            <Button asChild variant="link" className="px-0">
              <Link href={localizePathname("/dashboard/usage", locale)}>{text.viewAll}</Link>
            </Button>
          }
        >
          {activity.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/15 px-4 py-8 text-center text-sm text-muted-foreground">
              {text.activityEmpty}
            </div>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 5).map((item, index) => (
                <div
                  key={item.id}
                  className={`dashboard-hover-lift flex flex-col gap-2 rounded-xl border px-3.5 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between ${
                    index > 2 ? "hidden md:flex" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Wifi className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{item.type}</p>
                      <p className="truncate text-muted-foreground">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <Clock3 className="size-3.5" />
                    <span>{formatDateTime(item.timestamp, locale)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
