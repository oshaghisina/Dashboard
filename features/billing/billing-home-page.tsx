"use client"

import Link from "next/link"

import { invoices, subscriptionSummary } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatCurrency, formatDate } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function BillingHomePage() {
  const { locale } = useLocaleContext()

  return (
    <DashboardPage
      title={locale === "fa" ? "پرداخت و اشتراک" : "Billing"}
      description={
        locale === "fa"
          ? "پلن فعلی، سوابق پرداخت و مسیر تمدید اشتراک"
          : "Review your current plan, payment history, and renewal options."
      }
      actions={
        <>
          <Button asChild variant="outline">
            <Link href={localizePathname("/dashboard/billing/plans", locale)}>
              {locale === "fa" ? "تغییر پلن" : "Change plan"}
            </Link>
          </Button>
          <Button asChild>
            <Link href={localizePathname("/dashboard/billing/checkout?plan=pro&cycle=monthly", locale)}>
              {locale === "fa" ? "تمدید" : "Renew now"}
            </Link>
          </Button>
        </>
      }
    >
      <PageSection contentClassName="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionCard
          title={locale === "fa" ? "پلن فعلی" : "Current plan"}
          description={locale === "fa" ? "وضعیت اشتراک فعال" : "Active subscription status"}
          actions={<Badge>{subscriptionSummary.planName}</Badge>}
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{locale === "fa" ? "وضعیت" : "Status"}</span>
              <span>{subscriptionSummary.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{locale === "fa" ? "انقضا" : "Expires"}</span>
              <span>{subscriptionSummary.expiresAt ? formatDate(subscriptionSummary.expiresAt, locale) : "--"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{locale === "fa" ? "تمدید خودکار" : "Auto renew"}</span>
              <span>{subscriptionSummary.autoRenew ? "On" : "Off"}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={locale === "fa" ? "سوابق پرداخت" : "Billing history"}>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-sm">
                <div>
                  <p className="font-medium">
                    {invoice.planName} · {invoice.cycleLabel}
                  </p>
                  <p className="text-muted-foreground">{formatDate(invoice.date, locale)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatCurrency(invoice.amount, locale)}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={localizePathname(`/dashboard/billing/invoices/${invoice.id}`, locale)}>
                      {locale === "fa" ? "رسید" : "Receipt"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
