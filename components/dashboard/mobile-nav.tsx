"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Download, Ellipsis, Gift, LifeBuoy, Settings, Users } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { vpnNavigationItems } from "@/components/dashboard/navigation"

const moreItems = [
  {
    href: "/dashboard/downloads",
    icon: Download,
    key: "downloads",
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    key: "billing",
  },
  {
    href: "/dashboard/tickets",
    icon: LifeBuoy,
    key: "tickets",
  },
  {
    href: "/dashboard/referral",
    icon: Gift,
    key: "referral",
  },
  {
    href: "/dashboard/representatives",
    icon: Users,
    key: "representatives",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    key: "settings",
  },
] as const

export function MobileNav() {
  const pathname = usePathname()
  const { locale } = useLocaleContext()
  const { session } = useDemoSession()
  const [open, setOpen] = React.useState(false)
  const primaryItems = vpnNavigationItems.slice(0, 3)
  const visibleMoreItems = moreItems.filter(
    (item) =>
      item.key !== "representatives" ||
      session.user?.role === "representative"
  )

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {primaryItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.key}
                href={localizePathname(item.href, locale)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-2 py-2 text-center text-xs transition-colors",
                  isActive
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{item.title[locale]}</span>
              </Link>
            )
          })}
          <Button
            type="button"
            variant="ghost"
            className="flex h-auto min-h-14 flex-col rounded-xl px-2 py-2 text-xs"
            onClick={() => setOpen((current) => !current)}
          >
            <Ellipsis className="size-4" />
            <span>{locale === "fa" ? "بیشتر" : "More"}</span>
          </Button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 rounded-2xl border bg-background p-3 shadow-xl md:hidden">
          <div className="space-y-2">
            {visibleMoreItems.map((item) => {
              const source = vpnNavigationItems.find((entry) => entry.key === item.key)!
              const Icon = item.icon

              return (
                <Link
                  key={item.key}
                  href={localizePathname(item.href, locale)}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary/20 hover:bg-primary/5"
                  onClick={() => setOpen(false)}
                >
                  <Icon className="size-4" />
                  <span>{source.title[locale]}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </>
  )
}
