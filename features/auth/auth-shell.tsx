"use client"

import type { ReactNode } from "react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"
import { Card, CardContent } from "@/components/ui/card"

export function AuthShell({
  children,
  eyebrow,
}: {
  children: ReactNode
  eyebrow?: string
}) {
  const { direction, locale } = useLocaleContext()

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(38,99,235,0.10),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(245,248,255,0.98))] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-6xl flex-col justify-center gap-6">
        <div className={`flex flex-wrap items-center justify-between gap-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              {eyebrow ?? (locale === "fa" ? "تونل" : "Tunnel")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle className="rounded-full" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className={direction === "rtl" ? "lg:order-2" : ""}>
            <div className="space-y-4">
              <p className="inline-flex rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                {locale === "fa"
                  ? "فرانت‌اند دمو، بدون بک‌اند"
                  : "Frontend-only demo, no backend"}
              </p>
              <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
                {locale === "fa"
                  ? "مدیریت اشتراک VPN در یک داشبورد سریع و ساده"
                  : "Manage your VPN subscription in one fast, simple dashboard"}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {locale === "fa"
                  ? "ثبت‌نام، دریافت کانفیگ، بررسی مصرف، پرداخت و دعوت دوستان را با داده‌های ساختگی و تعاملات کامل رابط کاربری تجربه کنید."
                  : "Explore signup, config retrieval, usage tracking, billing, and referrals with fully mocked data and polished frontend interactions."}
              </p>
            </div>
          </div>

          <Card className="border-white/70 shadow-2xl shadow-primary/5">
            <CardContent className="p-6 sm:p-8">{children}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
