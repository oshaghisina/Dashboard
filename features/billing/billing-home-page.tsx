"use client"

import Link from "next/link"
import { ArrowUpRight, CreditCard, ReceiptText, Wallet } from "lucide-react"

import { LOW_WALLET_BALANCE } from "@/features/wallet/wallet-data"
import { useWallet } from "@/features/wallet/wallet-provider"
import { invoices, subscriptionSummary } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatCurrency, formatDate, formatToman } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function BillingHomePage() {
  const { locale } = useLocaleContext()
  const { balance, lastToppedUp, transactions } = useWallet()
  const lowBalance = balance < LOW_WALLET_BALANCE

  return (
    <DashboardPage
      title={locale === "fa" ? "پرداخت و اشتراک" : "Billing"}
      description={
        locale === "fa"
          ? "اشتراک، کیف پول، شارژ و سوابق پرداخت را در یک مسیر مدیریت کنید."
          : "Manage subscription, wallet, top-ups, and payment history in one flow."
      }
      actions={
        <>
          <Button asChild variant="outline">
            <Link href={localizePathname("/dashboard/billing/wallet", locale)}>
              <Wallet className="size-4" />
              {locale === "fa" ? "کیف پول" : "Wallet"}
            </Link>
          </Button>
          <Button asChild>
            <Link href={localizePathname("/dashboard/billing/checkout?plan=pro&cycle=monthly", locale)}>
              <CreditCard className="size-4" />
              {locale === "fa" ? "تمدید" : "Renew now"}
            </Link>
          </Button>
        </>
      }
    >
      <PageSection
        title={locale === "fa" ? "مرکز پرداخت" : "Billing hub"}
        description={
          locale === "fa"
            ? "برای تغییر پلن، شارژ کیف پول یا مشاهده تراکنش‌ها از همین بخش شروع کنید."
            : "Start here to change plans, top up wallet balance, or review transactions."
        }
        contentClassName="grid gap-4 xl:grid-cols-3"
      >
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
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button asChild size="sm">
                <Link href={localizePathname("/dashboard/billing/checkout?plan=pro&cycle=monthly", locale)}>
                  {locale === "fa" ? "تمدید" : "Renew"}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={localizePathname("/dashboard/billing/plans", locale)}>
                  {locale === "fa" ? "تغییر پلن" : "Change plan"}
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={locale === "fa" ? "کیف پول" : "Wallet"}
          description={
            lowBalance
              ? locale === "fa"
                ? "موجودی کیف پول کم است."
                : "Wallet balance is low."
              : locale === "fa"
                ? "موجودی آماده پرداخت"
                : "Balance ready for payments"
          }
          actions={<Badge variant={lowBalance ? "outline" : "secondary"}>{formatToman(balance, locale)}</Badge>}
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{locale === "fa" ? "آخرین شارژ" : "Last top-up"}</span>
              <span>{formatDate(lastToppedUp, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{locale === "fa" ? "تراکنش‌ها" : "Transactions"}</span>
              <span>{transactions.length}</span>
            </div>
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button asChild size="sm">
                <Link href={localizePathname("/dashboard/billing/wallet/topup", locale)}>
                  {locale === "fa" ? "شارژ کیف پول" : "Top up"}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={localizePathname("/dashboard/billing/wallet", locale)}>
                  {locale === "fa" ? "تراکنش‌ها" : "Transactions"}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={locale === "fa" ? "دسترسی سریع" : "Quick actions"}
          description={locale === "fa" ? "مسیرهای اصلی پرداخت" : "Primary money flows"}
        >
          <div className="grid gap-2">
            <Button asChild variant="outline" className="justify-between">
              <Link href={localizePathname("/dashboard/billing/plans", locale)}>
                <span>{locale === "fa" ? "پلن‌ها" : "Plans"}</span>
                <CreditCard className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href={localizePathname("/dashboard/billing/invoices", locale)}>
                <span>{locale === "fa" ? "فاکتورها" : "Invoices"}</span>
                <ReceiptText className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href={localizePathname("/dashboard/billing/wallet", locale)}>
                <span>{locale === "fa" ? "کیف پول" : "Wallet history"}</span>
                <Wallet className="size-4" />
              </Link>
            </Button>
          </div>
        </SectionCard>
      </PageSection>

      <PageSection>
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
