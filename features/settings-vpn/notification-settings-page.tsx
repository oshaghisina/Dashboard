"use client"

import * as React from "react"

import { notificationPreferences } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SectionCard } from "@/components/dashboard/section-card"

export function NotificationSettingsPage() {
  const { locale } = useLocaleContext()
  const { session } = useDemoSession()
  const { addToast } = useUiState()
  const [preferences, setPreferences] = React.useState(notificationPreferences)

  const rows = [
    { key: "quotaAlerts", label: locale === "fa" ? "هشدار حجم" : "Quota alerts" },
    { key: "expiryReminders", label: locale === "fa" ? "یادآوری انقضا" : "Expiry reminders" },
    { key: "paymentReceipts", label: locale === "fa" ? "رسید پرداخت" : "Payment receipts" },
    { key: "configChanges", label: locale === "fa" ? "تغییرات کانفیگ" : "Config changes" },
    { key: "walletAlerts", label: locale === "fa" ? "هشدار کیف پول" : "Wallet alerts" },
    ...(session.user?.role === "representative"
      ? [{ key: "representativeAlerts", label: locale === "fa" ? "هشدار نمایندگان" : "Representative alerts" } as const]
      : []),
    { key: "securityAlerts", label: locale === "fa" ? "هشدار امنیتی" : "Security alerts" },
  ] as const

  return (
    <DashboardPage
      title={locale === "fa" ? "تنظیمات اعلان‌ها" : "Notification preferences"}
      description={
        locale === "fa"
          ? "کانال دریافت هشدارها و اعلان‌ها را تعیین کنید."
          : "Choose how Tunnel should surface your alerts and reminders."
      }
      actions={
        <Button
          type="button"
          onClick={() =>
            addToast(locale === "fa" ? "تنظیمات ذخیره شد." : "Preferences saved.", "success")
          }
        >
          {locale === "fa" ? "ذخیره" : "Save preferences"}
        </Button>
      }
    >
      <SectionCard>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.key} className="flex flex-col gap-3 rounded-xl border px-3.5 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-muted-foreground">
                  {row.key === "securityAlerts"
                    ? locale === "fa"
                      ? "این هشدارها قابل غیرفعال کردن نیستند."
                      : "These alerts cannot be disabled."
                    : locale === "fa"
                      ? "اعلان درون برنامه و ایمیل"
                      : "In-app and email delivery"}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <div className="flex items-center justify-between gap-3 text-sm sm:justify-start">
                  <span>Email</span>
                  <Switch
                    checked={preferences[row.key].email}
                    disabled={row.key === "securityAlerts"}
                    onCheckedChange={(checked) =>
                      setPreferences((current) => ({
                        ...current,
                        [row.key]: { ...current[row.key], email: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-3 text-sm sm:justify-start">
                  <span>In-app</span>
                  <Switch
                    checked={preferences[row.key].inApp}
                    disabled={row.key === "securityAlerts"}
                    onCheckedChange={(checked) =>
                      setPreferences((current) => ({
                        ...current,
                        [row.key]: { ...current[row.key], inApp: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </DashboardPage>
  )
}
