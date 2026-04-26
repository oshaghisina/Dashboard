"use client"

import * as React from "react"
import Link from "next/link"
import { X } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatDate } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const copy = {
  en: {
    markAllRead: "Mark all read",
    notifications: "Notifications",
    viewAll: "View all notifications",
  },
  fa: {
    markAllRead: "خواندن همه",
    notifications: "اعلان‌ها",
    viewAll: "همه اعلان‌ها",
  },
} as const

export function NotificationDrawer() {
  const drawerRef = React.useRef<HTMLElement | null>(null)
  const { direction, locale } = useLocaleContext()
  const {
    markAllNotificationsRead,
    markNotificationRead,
    notifications,
    notificationsOpen,
    setNotificationsOpen,
  } = useUiState()
  const text = copy[locale]

  const closeDrawer = React.useCallback(() => {
    setNotificationsOpen(false)

    window.requestAnimationFrame(() => {
      const trigger = document.getElementById("dashboard-notifications-trigger")

      if (trigger instanceof HTMLButtonElement) {
        trigger.focus()
      }
    })
  }, [setNotificationsOpen])

  React.useEffect(() => {
    if (!notificationsOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeDrawer, notificationsOpen])

  React.useEffect(() => {
    if (notificationsOpen) {
      return
    }

    const activeElement = document.activeElement

    if (activeElement instanceof HTMLElement && drawerRef.current?.contains(activeElement)) {
      activeElement.blur()
    }
  }, [notificationsOpen])

  return (
    <>
      {notificationsOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ease-out motion-reduce:transition-none"
          onClick={closeDrawer}
        />
      ) : null}
      <aside
        ref={drawerRef}
        aria-hidden={!notificationsOpen}
        inert={!notificationsOpen}
        role={notificationsOpen ? "dialog" : undefined}
        aria-modal={notificationsOpen ? "true" : undefined}
        className={cn(
          "fixed z-50 border bg-background shadow-2xl transition-[transform,opacity] duration-220 ease-out motion-reduce:transition-none",
          "inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] top-auto max-h-[min(82svh,42rem)] overflow-hidden rounded-3xl md:inset-y-0 md:bottom-auto md:inset-x-auto md:w-[380px] md:max-w-md md:rounded-none",
          notificationsOpen ? "pointer-events-auto" : "pointer-events-none",
          direction === "rtl" ? "md:left-0" : "md:right-0",
          notificationsOpen
            ? "translate-x-0 translate-y-0 opacity-100"
            : direction === "rtl"
              ? "translate-y-[calc(100%+1.5rem)] opacity-0 md:-translate-x-full md:translate-y-0"
              : "translate-y-[calc(100%+1.5rem)] opacity-0 md:translate-x-full md:translate-y-0"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{text.notifications}</h2>
            <p className="text-sm text-muted-foreground">
              {notifications.filter((item) => item.unread).length} unread
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
            <Button type="button" variant="ghost" size="sm" onClick={markAllNotificationsRead}>
              {text.markAllRead}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={closeDrawer}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100%-88px)] flex-col md:h-[calc(100%-74px)]">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "dashboard-hover-lift rounded-xl border p-4",
                  notification.unread && "border-primary/50 bg-primary/5"
                )}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {notification.unread ? <Badge>New</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt, locale)}
                  </p>
                </div>
                {notification.ctaHref ? (
                  <Button
                    asChild
                    variant="link"
                    className="mt-2 px-0"
                    onClick={() => {
                      markNotificationRead(notification.id)
                      closeDrawer()
                    }}
                  >
                    <Link href={localizePathname(notification.ctaHref, locale)}>
                      {notification.ctaLabel}
                    </Link>
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          <div className="border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
            <Button
              asChild
              className="w-full"
              onClick={closeDrawer}
            >
              <Link href={localizePathname("/dashboard/notifications", locale)}>
                {text.viewAll}
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
