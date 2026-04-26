"use client"

import { usePathname } from "next/navigation"
import { Bell, Shield } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderProfileMenu } from "@/components/dashboard/header-profile-menu"
import {
  getCurrentVpnPage,
  notificationsMeta,
} from "@/components/dashboard/navigation"

export function AppHeader() {
  const pathname = usePathname()
  const { direction, locale } = useLocaleContext()
  const { notificationsOpen, setNotificationsOpen, unreadCount } = useUiState()
  const currentPage = getCurrentVpnPage(pathname)

  return (
    <header className="sticky top-0 z-20 border-b bg-background/92 backdrop-blur">
      <div className="px-4 py-2.5 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden rounded-xl border bg-background/80 p-1 md:block">
              <SidebarTrigger className="md:size-8" />
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Shield className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">
                  {locale === "fa" ? "تونل" : "Tunnel"}
                </p>
                <p className="hidden truncate text-xs text-muted-foreground md:block">
                  {currentPage.title[locale]}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`flex shrink-0 items-center gap-2 ${
              direction === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              id="dashboard-notifications-trigger"
              type="button"
              variant={unreadCount > 0 ? "default" : "outline"}
              size="icon-sm"
              className={cn(
                "relative rounded-full",
                unreadCount > 0 && "shadow-none"
              )}
              aria-label={notificationsMeta.title[locale]}
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <Badge
                  className={cn(
                    "pointer-events-none absolute -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]",
                    direction === "rtl" ? "-left-1" : "-right-1"
                  )}
                >
                  {Math.min(unreadCount, 9)}+
                </Badge>
              ) : null}
            </Button>
            <HeaderProfileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
