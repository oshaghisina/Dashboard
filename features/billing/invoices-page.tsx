"use client"

import Link from "next/link"

import { invoices } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatCurrency, formatDate } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SectionCard } from "@/components/dashboard/section-card"

export function InvoicesPage() {
  const { locale } = useLocaleContext()

  return (
    <DashboardPage
      title={locale === "fa" ? "رسیدها" : "Invoices"}
      description={
        locale === "fa"
          ? "فهرست کامل پرداخت‌ها و رسیدها"
          : "Browse your billing receipts and payment history."
      }
    >
      <SectionCard>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col gap-3 rounded-xl border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="break-all font-medium" dir="ltr">{invoice.id}</p>
                <p className="text-muted-foreground">{formatDate(invoice.date, locale)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span>{formatCurrency(invoice.amount, locale)}</span>
                <Button asChild variant="outline" size="sm">
                  <Link href={localizePathname(`/dashboard/billing/invoices/${invoice.id}`, locale)}>
                    {locale === "fa" ? "جزئیات" : "Details"}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </DashboardPage>
  )
}
