"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

import { CreateUserDrawer } from "@/features/representatives/create-user-drawer"
import { RepresentativeGuard } from "@/features/representatives/representative-guard"
import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatGigabytes } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function UsersListPage({ createOpen }: { createOpen?: boolean }) {
  const { locale } = useLocaleContext()
  const { users } = useRepresentatives()
  const [query, setQuery] = React.useState("")
  const normalizedQuery = query.trim().toLowerCase()
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.contact}`.toLowerCase().includes(normalizedQuery)
  )

  return (
    <RepresentativeGuard>
      <DashboardPage
        title={locale === "fa" ? "کاربران نماینده" : "Representative users"}
        description={
          locale === "fa"
            ? "کاربران، وضعیت کانفیگ و مصرف هر کاربر را ببینید."
            : "Review users, config status, and usage."
        }
        actions={
          <Button asChild>
            <Link href={localizePathname("/dashboard/representatives/users/new", locale)}>
              <Plus className="size-4" />
              {locale === "fa" ? "افزودن کاربر" : "Add user"}
            </Link>
          </Button>
        }
      >
        <PageSection>
          <div className="relative">
            <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="ps-9"
              placeholder={locale === "fa" ? "جستجوی کاربر" : "Search users"}
            />
          </div>
        </PageSection>

        <PageSection>
          <SectionCard title={locale === "fa" ? "فهرست کاربران" : "Users"}>
            {filteredUsers.length === 0 ? (
              <EmptyState
                title={locale === "fa" ? "کاربری پیدا نشد" : "No users found"}
                description={
                  locale === "fa"
                    ? "فیلتر را تغییر دهید یا کاربر جدید اضافه کنید."
                    : "Adjust the search or add a new user."
                }
              />
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const totalCap = user.configs.reduce((sum, c) => sum + (c.dataCapGb ?? 0), 0)
                  const usedGb = user.usage.totalGb
                  const percent = totalCap > 0 ? Math.min((usedGb / totalCap) * 100, 100) : 0
                  const barColor =
                    totalCap === 0
                      ? "bg-muted-foreground/30"
                      : percent >= 90
                        ? "bg-destructive"
                        : percent >= 75
                          ? "bg-amber-500"
                          : "bg-primary"
                  const statusLabel =
                    user.status === "active"
                      ? locale === "fa" ? "فعال" : "Active"
                      : user.status === "expiring"
                        ? locale === "fa" ? "در حال انقضا" : "Expiring"
                        : locale === "fa" ? "غیرفعال" : "Inactive"

                  return (
                    <div key={user.id} className="rounded-xl border px-3.5 py-3 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.contact}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant={user.status === "active" ? "secondary" : "outline"}>
                            {statusLabel}
                          </Badge>
                          <Button asChild size="sm" variant="outline">
                            <Link href={localizePathname(`/dashboard/representatives/users/${user.id}`, locale)}>
                              {locale === "fa" ? "نمایش" : "View"}
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                          <span>{user.configs.length} {locale === "fa" ? "کانفیگ" : "configs"}</span>
                          <span>
                            {totalCap > 0
                              ? `${formatGigabytes(usedGb, locale)} / ${formatGigabytes(totalCap, locale)} GB`
                              : locale === "fa" ? "بدون کانفیگ" : "No configs"}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          {totalCap > 0 ? (
                            <div
                              className={`h-1.5 rounded-full transition-all ${barColor}`}
                              style={{ width: `${percent}%` }}
                            />
                          ) : (
                            <div className="h-1.5 rounded-full bg-muted-foreground/20 w-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>
        </PageSection>
        {createOpen ? <CreateUserDrawer /> : null}
      </DashboardPage>
    </RepresentativeGuard>
  )
}
