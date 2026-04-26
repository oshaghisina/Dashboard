"use client"

import * as React from "react"
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react"

import type { NotificationRecord } from "@/lib/types"
import { initialNotifications } from "@/lib/mock-data/vpn"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ToastTone = "default" | "success" | "warning"

interface ToastRecord {
  exiting?: boolean
  id: string
  message: string
  tone: ToastTone
}

interface UiContextValue {
  addToast: (message: string, tone?: ToastTone) => void
  markAllNotificationsRead: () => void
  markNotificationRead: (id: string) => void
  notifications: NotificationRecord[]
  notificationsOpen: boolean
  setNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>
  unreadCount: number
}

const UiContext = React.createContext<UiContextValue | null>(null)

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] =
    React.useState<NotificationRecord[]>(initialNotifications)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const [toasts, setToasts] = React.useState<ToastRecord[]>([])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
    )

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 180)
  }, [])

  const addToast = React.useCallback((message: string, tone: ToastTone = "default") => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message, tone }])

    window.setTimeout(() => {
      dismissToast(id)
    }, tone === "warning" ? 6000 : 4000)
  }, [dismissToast])

  const markAllNotificationsRead = React.useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    )
  }, [])

  const markNotificationRead = React.useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    )
  }, [])

  const unreadCount = notifications.filter((item) => item.unread).length

  return (
    <UiContext.Provider
      value={{
        addToast,
        markAllNotificationsRead,
        markNotificationRead,
        notifications,
        notificationsOpen,
        setNotificationsOpen,
        unreadCount,
      }}
    >
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[360px] sm:items-stretch">
        {toasts.map((toast) => {
          const Icon =
            toast.tone === "success"
              ? CheckCircle2
              : toast.tone === "warning"
                ? TriangleAlert
                : Info

          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-lg transition-[opacity,transform] duration-180 ease-out motion-reduce:transition-none",
                toast.exiting
                  ? "translate-y-1 opacity-0 motion-reduce:translate-y-0"
                  : "dashboard-motion-enter"
              )}
            >
              <Icon className="size-4 text-primary" />
              <p className="flex-1 text-sm">{toast.message}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </UiContext.Provider>
  )
}

export function useUiState() {
  const context = React.useContext(UiContext)

  if (!context) {
    throw new Error("useUiState must be used within UiProvider")
  }

  return context
}
