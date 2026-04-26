"use client"

import * as React from "react"
import Link from "next/link"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatDate } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

type FilterKey = "all" | "billing" | "config" | "system" | "usage" | "wallet" | "representative"

export function NotificationsPage() {
  const { locale } = useLocaleContext()
  const { session } = useDemoSession()
  const { markAllNotificationsRead, markNotificationRead, notifications } = useUiState()
  const [filter, setFilter] = React.useState<FilterKey>("all")
  const filterKeys: FilterKey[] = ["all", "billing", "usage", "config", "wallet", "system"]

  if (session.user?.role === "representative") {
    filterKeys.splice(filterKeys.length - 1, 0, "representative")
  }

  const visibleNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((item) => item.category === filter)

  return (
    <DashboardPage
      title={locale === "fa" ? "اعلان‌ها" : "Notifications"}
      description={
        locale === "fa"
          ? "تمام اعلان‌های مصرف، پرداخت، کانفیگ و سیستم"
          : "All of your usage, billing, config, and system alerts"
      }
      actions={
        <Button type="button" variant="outline" onClick={markAllNotificationsRead}>
          {locale === "fa" ? "خواندن همه" : "Mark all read"}
        </Button>
      }
    >
      <PageSection>
        <div className="flex flex-wrap gap-2">
          {filterKeys.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={filter === item ? "default" : "outline"}
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionCard title={locale === "fa" ? "فهرست اعلان‌ها" : "All notifications"}>
          <div className="space-y-3">
            {visibleNotifications.map((item) => (
              <div key={item.id} className={`rounded-xl border p-4 ${item.unread ? "border-primary/30 bg-primary/6" : "bg-card/95"}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.title}</p>
                      {item.unread ? <Badge>{locale === "fa" ? "جدید" : "New"}</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(item.createdAt, locale)}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => markNotificationRead(item.id)}>
                    {locale === "fa" ? "خوانده شد" : "Mark read"}
                  </Button>
                </div>
                {item.ctaHref ? (
                  <Button asChild variant="link" className="mt-2 px-0">
                    <Link href={localizePathname(item.ctaHref, locale)}>{item.ctaLabel}</Link>
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
