"use client"

import { invoices } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatCurrency, formatDate } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SectionCard } from "@/components/dashboard/section-card"

export function InvoiceDetailPage({ invoiceId }: { invoiceId: string }) {
  const { locale } = useLocaleContext()
  const invoice = invoices.find((item) => item.id === invoiceId) ?? invoices[0]

  return (
    <DashboardPage
      title={locale === "fa" ? "جزئیات رسید" : "Invoice detail"}
      description={invoice.id}
      actions={
        <Button type="button" variant="outline">
          {locale === "fa" ? "دانلود PDF" : "Download PDF"}
        </Button>
      }
    >
      <SectionCard title={invoice.planName} description={formatDate(invoice.date, locale)}>
        <div className="space-y-3 text-sm">
          <div className="overflow-x-auto rounded-xl border bg-muted/20 p-3" dir="ltr">
            <code className="block min-w-max break-all">{invoice.id}</code>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{locale === "fa" ? "دوره" : "Cycle"}</span>
            <span>{invoice.cycleLabel}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{locale === "fa" ? "مبلغ" : "Total paid"}</span>
            <span>{formatCurrency(invoice.amount, locale)}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{locale === "fa" ? "روش پرداخت" : "Payment method"}</span>
            <span>{invoice.paymentMethod}</span>
          </div>
        </div>
      </SectionCard>
    </DashboardPage>
  )
}
