"use client"

import Link from "next/link"
import { Globe, MoonStar, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { demoUserProfile } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function SettingsPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocaleContext()
  const { expireSession } = useDemoSession()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <DashboardPage
      title={locale === "fa" ? "تنظیمات" : "Settings"}
      description={
        locale === "fa"
          ? "زبان، اعلان‌ها و کنترل‌های حساب دمو"
          : "Language, alerts, and demo account controls"
      }
    >
      <PageSection contentClassName="grid gap-4 2xl:grid-cols-2">
        <SectionCard title={locale === "fa" ? "پروفایل" : "Profile"}>
          <div className="space-y-1.5 text-sm">
            <p className="font-medium">{demoUserProfile.displayName}</p>
            <p className="break-all text-muted-foreground" dir="ltr">{demoUserProfile.email}</p>
            <p className="text-muted-foreground">
              {locale === "fa" ? "پلن فعلی" : "Current plan"}: {demoUserProfile.planName}
            </p>
          </div>
        </SectionCard>

        <SectionCard title={locale === "fa" ? "زبان و نمایش" : "Language & appearance"}>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setLocale(locale === "en" ? "fa" : "en")}>
              <Globe className="size-4" />
              {locale === "fa" ? "تغییر به انگلیسی" : "Switch to Persian"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <MoonStar className="size-4" />
              {locale === "fa"
                ? isDark
                  ? "تغییر به حالت روشن"
                  : "تغییر به حالت تیره"
                : isDark
                  ? "Switch to light mode"
                  : "Switch to dark mode"}
            </Button>
          </div>
        </SectionCard>
      </PageSection>

      <PageSection contentClassName="grid gap-4 2xl:grid-cols-2">
        <SectionCard
          title={locale === "fa" ? "اعلان‌ها" : "Notifications"}
          description={
            locale === "fa"
              ? "ترجیحات اعلان‌های داخل برنامه و ایمیل"
              : "Manage your in-app and email notification preferences"
          }
        >
          <Button asChild>
            <Link href={localizePathname("/dashboard/settings/notifications", locale)}>
              {locale === "fa" ? "باز کردن تنظیمات اعلان‌ها" : "Open notification preferences"}
            </Link>
          </Button>
        </SectionCard>

        <SectionCard
          title={locale === "fa" ? "کنترل‌های دمو" : "Demo controls"}
          description={
            locale === "fa"
              ? "برای تست جریان انقضای نشست"
              : "Use this to simulate an expired session flow"
          }
        >
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              expireSession()
              router.push("/login?reason=expired")
            }}
          >
            <ShieldAlert className="size-4" />
            {locale === "fa" ? "انقضای نشست" : "Expire session"}
          </Button>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
