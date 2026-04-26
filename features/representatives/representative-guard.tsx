"use client"

import { ShieldAlert } from "lucide-react"

import { useDemoSession } from "@/components/providers/session-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"

export function RepresentativeGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useDemoSession()
  const { locale } = useLocaleContext()

  if (session.user?.role !== "representative") {
    return (
      <DashboardPage title={locale === "fa" ? "نمایندگان" : "Representatives"}>
        <div className="rounded-xl border border-dashed">
          <EmptyState
            title={
              locale === "fa"
                ? "این بخش فقط برای نمایندگان فعال است"
                : "This section is available to Representatives only."
            }
            description={
              locale === "fa"
                ? "برای فعال شدن این دسترسی با پشتیبانی تماس بگیرید."
                : "Contact support to learn more."
            }
            action={<ShieldAlert className="mx-auto size-8 text-muted-foreground" />}
          />
        </div>
      </DashboardPage>
    )
  }

  return children
}
