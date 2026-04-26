"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import { AssignConfigDrawer } from "@/features/representatives/assign-config-drawer"
import { ExtendConfigDrawer } from "@/features/representatives/extend-config-drawer"
import { RepresentativeGuard } from "@/features/representatives/representative-guard"
import { type RepConfig } from "@/features/representatives/representatives-data"
import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatDate, formatDateTime, formatGigabytes } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function UserDetailPage({
  assignOpen,
  userId,
}: {
  assignOpen?: boolean
  userId: string
}) {
  const { locale } = useLocaleContext()
  const { users } = useRepresentatives()
  const user = users.find((item) => item.id === userId)
  const [extensionConfig, setExtensionConfig] = React.useState<RepConfig | null>(null)

  if (!user) {
    return (
      <RepresentativeGuard>
        <DashboardPage title={locale === "fa" ? "کاربر پیدا نشد" : "User not found"}>
          <EmptyState title={locale === "fa" ? "کاربر پیدا نشد" : "User not found"} />
        </DashboardPage>
      </RepresentativeGuard>
    )
  }

  return (
    <RepresentativeGuard>
      <DashboardPage
        title={user.name}
        description={`${user.contact} · ${locale === "fa" ? "عضویت" : "Joined"} ${formatDate(user.joinedAt, locale)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={localizePathname("/dashboard/representatives/users", locale)}>
                <ArrowLeft className="size-4" />
                {locale === "fa" ? "کاربران" : "Users"}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localizePathname(`/dashboard/representatives/users/${user.id}?assign=1`, locale)}>
                <Plus className="size-4" />
                {locale === "fa" ? "تخصیص کانفیگ" : "Assign config"}
              </Link>
            </Button>
          </>
        }
      >
        <PageSection contentClassName="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SectionCard title={locale === "fa" ? "کانفیگ‌ها" : "Configs"}>
            {user.configs.length === 0 ? (
              <EmptyState
                title={locale === "fa" ? "کانفیگی وجود ندارد" : "No configs assigned yet"}
                action={
                  <Button asChild>
                    <Link href={localizePathname(`/dashboard/representatives/users/${user.id}?assign=1`, locale)}>
                      {locale === "fa" ? "تخصیص کانفیگ" : "Assign config"}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {user.configs.map((config) => {
                  const percent = config.totalGb ? Math.min((config.usedGb / config.totalGb) * 100, 100) : 0

                  return (
                    <div key={config.id} className="space-y-3 rounded-xl border px-3.5 py-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{config.server}</p>
                            <Badge variant={config.status === "active" ? "secondary" : "outline"}>{config.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {locale === "fa" ? "انقضا" : "Expires"}: {formatDate(config.expiresAt, locale)}
                          </p>
                        </div>
                        <Button type="button" size="sm" variant="outline" onClick={() => setExtensionConfig(config)}>
                          {locale === "fa" ? "شارژ / تمدید" : "Charge / Extend"}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatGigabytes(config.usedGb, locale)} / {config.totalGb ?? "Unlimited"} GB
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard title={locale === "fa" ? "مصرف این ماه" : "Usage this month"}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span>{locale === "fa" ? "مصرف کل" : "Total bandwidth"}</span><strong>{formatGigabytes(user.usage.totalGb, locale)} GB</strong></div>
              <div className="flex justify-between gap-3"><span>{locale === "fa" ? "آخرین فعالیت" : "Last active"}</span><strong>{formatDateTime(user.usage.lastActive, locale)}</strong></div>
              <div className="flex justify-between gap-3"><span>{locale === "fa" ? "جلسات" : "Sessions"}</span><strong>{user.usage.sessions}</strong></div>
              {user.notes ? <p className="rounded-xl border bg-muted/20 p-3 text-muted-foreground">{user.notes}</p> : null}
            </div>
          </SectionCard>
        </PageSection>
        {assignOpen ? <AssignConfigDrawer userId={user.id} /> : null}
        {extensionConfig ? (
          <ExtendConfigDrawer
            config={extensionConfig}
            userId={user.id}
            onClose={() => setExtensionConfig(null)}
          />
        ) : null}
      </DashboardPage>
    </RepresentativeGuard>
  )
}
