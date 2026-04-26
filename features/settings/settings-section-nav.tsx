"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import {
  localizePathname,
  stripLocalePrefix,
  type AppLocale,
} from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const settingsLinks = [
  {
    href: "/dashboard/settings",
    key: "workspace",
  },
  {
    href: "/dashboard/settings/members",
    key: "members",
  },
] as const

export function SettingsSectionNav() {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const normalizedPath = stripLocalePrefix(pathname).pathname
  const t = useTranslations("dashboardContent.settings.nav")

  return (
    <div className="flex flex-wrap gap-2">
      {settingsLinks.map((item) => {
        const isActive =
          normalizedPath === item.href ||
          (item.href !== "/dashboard/settings" &&
            normalizedPath.startsWith(`${item.href}/`))

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={cn(!isActive && "bg-background")}
          >
            <Link href={localizePathname(item.href, locale)}>
              {t(item.key)}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
