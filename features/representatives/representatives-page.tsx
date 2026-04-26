"use client"

import Link from "next/link"
import { Plus, RefreshCcw, Users, Wallet } from "lucide-react"

import { AssignConfigDrawer } from "@/features/representatives/assign-config-drawer"
import { RepresentativeGuard } from "@/features/representatives/representative-guard"
import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatDate, formatNumber, formatToman } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"
import { StatCard } from "@/components/dashboard/stat-card"

export function RepresentativesPage({
  assignOpen,
}: {
  assignOpen?: boolean
}) {
  const { locale } = useLocaleContext()
  const { users } = useRepresentatives()
  const { balance } = useWallet()
  const activeConfigs = users.flatMap((user) => user.configs).filter((config) => config.status !== "expired")
  const expiringSoon = users.flatMap((user) =>
    user.configs
      .filter((config) => config.status === "expiring")
      .map((config) => ({ config, user }))
  )

  return (
    <RepresentativeGuard>
      <DashboardPage
        title={locale === "fa" ? "نمایندگان" : "Representatives"}
        description={
          locale === "fa"
            ? "کاربران و کانفیگ‌های VPN آن‌ها را مدیریت کنید."
            : "Manage your users and their VPN configs."
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={localizePathname("/dashboard/representatives/users/new", locale)}>
                <Plus className="size-4" />
                {locale === "fa" ? "افزودن کاربر" : "Add user"}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localizePathname("/dashboard/representatives/configs/new", locale)}>
                <Plus className="size-4" />
                {locale === "fa" ? "تخصیص کانفیگ" : "Assign config"}
              </Link>
            </Button>
          </>
        }
      >
        {users.length === 0 ? (
          <EmptyState
            title={locale === "fa" ? "هنوز کاربری ندارید" : "No users yet"}
            description={
              locale === "fa"
                ? "اولین کاربر خود را اضافه کنید."
                : "Add your first user to get started."
            }
          />
        ) : (
          <>
            <PageSection contentClassName="grid gap-3 lg:grid-cols-3">
              <StatCard
                label={locale === "fa" ? "کل کاربران" : "Total users"}
                value={formatNumber(users.length, locale)}
                trend={locale === "fa" ? "۲ کاربر جدید" : "+2 this month"}
                icon={<Users className="size-4" />}
              />
              <StatCard
                label={locale === "fa" ? "کانفیگ فعال" : "Active configs"}
                value={formatNumber(activeConfigs.length, locale)}
                trend={
                  locale === "fa"
                    ? `${formatNumber(expiringSoon.length, locale)} رو به انقضا`
                    : `${expiringSoon.length} expiring`
                }
                icon={<RefreshCcw className="size-4" />}
              />
              <StatCard
                label={locale === "fa" ? "موجودی کیف پول" : "Wallet balance"}
                value={formatToman(balance, locale)}
                meta={locale === "fa" ? "برای شارژ کانفیگ‌ها" : "For config charges"}
                icon={<Wallet className="size-4" />}
              />
            </PageSection>

            <PageSection>
              <SectionCard title={locale === "fa" ? "رو به انقضا" : "Expiring soon"}>
                {expiringSoon.length === 0 ? (
                  <EmptyState
                    title={locale === "fa" ? "کانفیگ رو به انقضا ندارید" : "No configs expiring soon"}
                  />
                ) : (
                  <div className="space-y-2">
                    {expiringSoon.map(({ config, user }) => (
                      <div key={config.id} className="flex flex-col gap-3 rounded-xl border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant="outline">{config.server}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {locale === "fa" ? "انقضا" : "Expires"}: {formatDate(config.expiresAt, locale)}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={localizePathname(`/dashboard/representatives/users/${user.id}`, locale)}>
                            {locale === "fa" ? "تمدید" : "Renew"}
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </PageSection>
          </>
        )}
        {assignOpen ? <AssignConfigDrawer /> : null}
      </DashboardPage>
    </RepresentativeGuard>
  )
}
