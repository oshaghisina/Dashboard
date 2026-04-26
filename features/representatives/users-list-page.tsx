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
                {filteredUsers.map((user) => (
                  <div key={user.id} className="grid gap-3 rounded-xl border px-3.5 py-3 md:grid-cols-[1fr_140px_120px_120px_auto] md:items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.contact}</p>
                    </div>
                    <span className="text-sm">{user.configs.length} {locale === "fa" ? "کانفیگ" : "configs"}</span>
                    <span className="text-sm">{formatGigabytes(user.usage.totalGb, locale)} GB</span>
                    <Badge variant={user.status === "active" ? "secondary" : user.status === "expiring" ? "outline" : "outline"}>
                      {user.status}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={localizePathname(`/dashboard/representatives/users/${user.id}`, locale)}>
                        {locale === "fa" ? "نمایش" : "View"}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </PageSection>
        {createOpen ? <CreateUserDrawer /> : null}
      </DashboardPage>
    </RepresentativeGuard>
  )
}
