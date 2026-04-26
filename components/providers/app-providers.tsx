"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { DashboardRouteProviders } from "@/components/dashboard-route-providers"
import { LocaleProvider } from "@/components/providers/locale-provider"
import { DemoSessionProvider } from "@/components/providers/session-provider"
import { UiProvider } from "@/components/providers/ui-provider"
import type { AppLocale, DemoSessionStatus } from "@/lib/types"

export function AppProviders({
  children,
  initialLocale,
  initialSessionStatus,
}: {
  children: React.ReactNode
  initialLocale: AppLocale
  initialSessionStatus: DemoSessionStatus
}) {
  return (
    <ThemeProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <DemoSessionProvider initialStatus={initialSessionStatus}>
          <UiProvider>
            <DashboardRouteProviders>{children}</DashboardRouteProviders>
          </UiProvider>
        </DemoSessionProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
