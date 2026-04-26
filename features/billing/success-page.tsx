"use client"

import Link from "next/link"

import { invoices, planOptions } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatDate } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SectionCard } from "@/components/dashboard/section-card"

export function BillingSuccessPage({
  cycle,
  planId,
}: {
  cycle: string
  planId: string
}) {
  const { locale } = useLocaleContext()
  const plan = planOptions.find((item) => item.id === planId) ?? planOptions[1]
  const invoice = invoices[0]

  return (
    <DashboardPage
      title={locale === "fa" ? "پرداخت موفق" : "Payment successful"}
      description={
        locale === "fa"
          ? "پلن شما فعال شد و کانفیگ‌ها آماده هستند."
          : "Your plan is active and your configs are ready."
      }
    >
      <SectionCard title={plan.name} description={`${cycle} · ${invoice.id}`}>
        <div className="space-y-4 text-sm">
          <p>{locale === "fa" ? "فعال تا" : "Active until"} {formatDate("2026-05-11T09:00:00.000Z", locale)}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={localizePathname("/dashboard", locale)}>
                {locale === "fa" ? "رفتن به داشبورد" : "Go to dashboard"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={localizePathname(`/dashboard/billing/invoices/${invoice.id}`, locale)}>
                {locale === "fa" ? "مشاهده رسید" : "View receipt"}
              </Link>
            </Button>
          </div>
        </div>
      </SectionCard>
    </DashboardPage>
  )
}
