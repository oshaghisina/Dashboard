import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Bell,
  CreditCard,
  Download,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Shield,
} from "lucide-react"

import type { AppLocale } from "@/lib/types"

export type VpnNavKey =
  | "overview"
  | "configs"
  | "downloads"
  | "usage"
  | "billing"
  | "tickets"
  | "referral"
  | "settings"
  | "notifications"

export interface VpnNavigationItem {
  href: string
  icon: LucideIcon
  key: VpnNavKey
  title: Record<AppLocale, string>
  hint: Record<AppLocale, string>
}

export const vpnNavigationItems: VpnNavigationItem[] = [
  {
    href: "/dashboard",
    hint: {
      en: "Subscription health, usage, and activity at a glance",
      fa: "نمای کلی اشتراک، مصرف و فعالیت‌ها",
    },
    icon: LayoutDashboard,
    key: "overview",
    title: {
      en: "Overview",
      fa: "خانه",
    },
  },
  {
    href: "/dashboard/configs",
    hint: {
      en: "Copy, download, or scan your active config profiles",
      fa: "نمایش، کپی و دانلود کانفیگ‌ها",
    },
    icon: Shield,
    key: "configs",
    title: {
      en: "Configs",
      fa: "کانفیگ‌ها",
    },
  },
  {
    href: "/dashboard/downloads",
    hint: {
      en: "Download recommended VPN clients for every device",
      fa: "دانلود اپ‌های پیشنهادی برای همه دستگاه‌ها",
    },
    icon: Download,
    key: "downloads",
    title: {
      en: "Downloads",
      fa: "دانلود اپ‌ها",
    },
  },
  {
    href: "/dashboard/usage",
    hint: {
      en: "Bandwidth, sessions, devices, and quota alerts",
      fa: "مصرف پهنای باند، نشست‌ها و دستگاه‌ها",
    },
    icon: Activity,
    key: "usage",
    title: {
      en: "Usage",
      fa: "مصرف",
    },
  },
  {
    href: "/dashboard/billing",
    hint: {
      en: "Plans, checkout, renewals, and receipts",
      fa: "پلن‌ها، پرداخت و رسیدها",
    },
    icon: CreditCard,
    key: "billing",
    title: {
      en: "Billing",
      fa: "پرداخت",
    },
  },
  {
    href: "/dashboard/tickets",
    hint: {
      en: "Support tickets, replies, and request status",
      fa: "تیکت‌های پشتیبانی، پاسخ‌ها و وضعیت رسیدگی",
    },
    icon: LifeBuoy,
    key: "tickets",
    title: {
      en: "Tickets",
      fa: "تیکت‌ها",
    },
  },
  {
    href: "/dashboard/referral",
    hint: {
      en: "Referral code, rewards, and invite history",
      fa: "کد دعوت، پاداش و تاریخچه",
    },
    icon: Gift,
    key: "referral",
    title: {
      en: "Referral",
      fa: "دعوت دوستان",
    },
  },
  {
    href: "/dashboard/settings",
    hint: {
      en: "Preferences, language, alerts, and account controls",
      fa: "تنظیمات حساب، زبان و اعلان‌ها",
    },
    icon: Settings,
    key: "settings",
    title: {
      en: "Settings",
      fa: "تنظیمات",
    },
  },
]

export const notificationsMeta = {
  href: "/dashboard/notifications",
  icon: Bell,
  key: "notifications" as const,
  title: {
    en: "Notifications",
    fa: "اعلان‌ها",
  },
  hint: {
    en: "Alerts, receipts, config updates, and system notices",
    fa: "هشدارها، رسیدها و اعلان‌های سیستم",
  },
}

export function isVpnPathActive(itemHref: string, pathname: string) {
  return (
    pathname === itemHref ||
    (itemHref !== "/dashboard" && pathname.startsWith(`${itemHref}/`))
  )
}

export function getCurrentVpnPage(pathname: string) {
  return (
    vpnNavigationItems.find((item) => isVpnPathActive(item.href, pathname)) ??
    (pathname.startsWith("/dashboard/notifications")
      ? notificationsMeta
      : vpnNavigationItems[0])
  )
}
