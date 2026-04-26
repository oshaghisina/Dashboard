"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, Monitor, Moon, Settings, Sun } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

const copy = {
  en: {
    appearance: "Appearance",
    language: "Language",
    menu: "Open profile menu",
    settings: "Settings",
    signOut: "Sign out",
    switchToEnglish: "English",
    switchToPersian: "فارسی",
    themeDark: "Dark mode",
    themeLight: "Light mode",
  },
  fa: {
    appearance: "نمایش",
    language: "زبان",
    menu: "باز کردن منوی حساب",
    settings: "تنظیمات",
    signOut: "خروج",
    switchToEnglish: "English",
    switchToPersian: "فارسی",
    themeDark: "حالت تیره",
    themeLight: "حالت روشن",
  },
} as const

export function HeaderProfileMenu() {
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { direction, locale, setLocale } = useLocaleContext()
  const { resolvedTheme, setTheme } = useTheme()
  const { session, signOut } = useDemoSession()
  const [open, setOpen] = React.useState(false)

  const user = session.user
  const text = copy[locale]
  const isDark = resolvedTheme === "dark"

  React.useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null

      if (
        target &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-full px-2 sm:px-3"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={text.menu}
        onClick={() => setOpen((current) => !current)}
      >
        <Avatar size="sm" className="ring-1 ring-border">
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm sm:inline">
          {user.displayName}
        </span>
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-transparent"
            onClick={() => setOpen(false)}
            aria-label={text.menu}
          />
          <div
            ref={menuRef}
            role="dialog"
            aria-modal="false"
            className={cn(
              "absolute z-40 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border bg-background shadow-2xl",
              direction === "rtl" ? "left-0" : "right-0",
              "max-md:fixed max-md:inset-x-3 max-md:top-16 max-md:mt-0"
            )}
          >
            <div className="space-y-3 border-b bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg" className="ring-1 ring-border">
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{user.displayName}</p>
                  <p className="truncate text-sm text-muted-foreground" dir="ltr">
                    {user.email}
                  </p>
                </div>
              </div>
              <Badge variant={user.planBadgeTone}>{user.planName}</Badge>
            </div>

            <div className="space-y-1 p-2">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
                onClick={() => {
                  setLocale(locale === "en" ? "fa" : "en")
                  setOpen(false)
                }}
              >
                <span className="text-muted-foreground">{text.language}</span>
                <span>{locale === "en" ? text.switchToPersian : text.switchToEnglish}</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
                onClick={() => {
                  setTheme(isDark ? "light" : "dark")
                  setOpen(false)
                }}
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {text.appearance}
                </span>
                <span>{isDark ? text.themeLight : text.themeDark}</span>
              </button>

              <Button
                asChild
                variant={pathname.startsWith("/dashboard/settings") ? "secondary" : "ghost"}
                className="w-full justify-start rounded-xl px-3"
                onClick={() => setOpen(false)}
              >
                <Link href={localizePathname("/dashboard/settings", locale)}>
                  <Settings className="size-4" />
                  <span>{text.settings}</span>
                </Link>
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 text-destructive hover:text-destructive"
                onClick={() => {
                  signOut()
                  setOpen(false)
                  router.push("/login")
                }}
              >
                <LogOut className="size-4" />
                <span>{text.signOut}</span>
              </Button>
            </div>

            <div className="border-t px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Monitor className="size-3.5" />
                <span>
                  {locale === "fa"
                    ? "تنظیمات شخصی و کنترل‌های حساب دمو"
                    : "Personal preferences and demo account controls"}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
