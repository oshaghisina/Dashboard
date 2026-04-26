"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Filter, Plus, RefreshCcw, TriangleAlert, Wallet } from "lucide-react"

import {
  LOW_WALLET_BALANCE,
  type WalletTransactionType,
} from "@/features/wallet/wallet-data"
import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatDate, formatToman } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

type WalletFilter = "all" | "deposit" | "purchase" | "charge" | "refund"
type WalletState = "default" | "loading" | "error" | "empty" | "zero"

function parseWalletState(value?: string): WalletState {
  return value === "loading" ||
    value === "error" ||
    value === "empty" ||
    value === "zero"
    ? value
    : "default"
}

function filterTransaction(type: WalletTransactionType, filter: WalletFilter) {
  if (filter === "all") return true
  if (filter === "purchase") return type === "plan_purchase"
  if (filter === "charge") {
    return type === "config_charge" || type === "representative_deduction"
  }
  return type === filter
}

export function WalletPage({ state }: { state?: string }) {
  const demoState = parseWalletState(state)
  const { locale } = useLocaleContext()
  const { balance, lastToppedUp, transactions } = useWallet()
  const [filter, setFilter] = React.useState<WalletFilter>("all")
  const effectiveBalance = demoState === "zero" ? 0 : balance
  const effectiveTransactions = demoState === "empty" ? [] : transactions
  const visibleTransactions = effectiveTransactions.filter((transaction) =>
    filterTransaction(transaction.type, filter)
  )
  const lowBalance = effectiveBalance < LOW_WALLET_BALANCE

  if (demoState === "loading") {
    return (
      <DashboardPage title={locale === "fa" ? "کیف پول" : "Wallet"}>
        <PageSection contentClassName="grid gap-4 xl:grid-cols-[360px_1fr]">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </PageSection>
      </DashboardPage>
    )
  }

  if (demoState === "error") {
    return (
      <DashboardPage title={locale === "fa" ? "کیف پول" : "Wallet"}>
        <SectionCard
          title={locale === "fa" ? "کیف پول بارگذاری نشد" : "Wallet could not be loaded"}
          description={
            locale === "fa"
              ? "داده‌های دمو کیف پول در دسترس نیستند."
              : "The demo wallet data is temporarily unavailable."
          }
          actions={
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCcw className="size-4" />
              {locale === "fa" ? "تلاش دوباره" : "Retry"}
            </Button>
          }
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TriangleAlert className="size-4 text-destructive" />
            <span>{locale === "fa" ? "دوباره امتحان کنید." : "Please try again."}</span>
          </div>
        </SectionCard>
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      title={locale === "fa" ? "کیف پول" : "Wallet"}
      description={
        locale === "fa"
          ? "موجودی، شارژ و تاریخچه تراکنش‌های خود را مدیریت کنید."
          : "Manage your balance, top-ups, and transaction history."
      }
      actions={
        <Button asChild>
          <Link href={localizePathname("/dashboard/billing/wallet/topup", locale)}>
            <Plus className="size-4" />
            {locale === "fa" ? "شارژ کیف پول" : "Top up wallet"}
          </Link>
        </Button>
      }
    >
      {lowBalance ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:bg-amber-500/10 dark:text-amber-200">
          <TriangleAlert className="size-4" />
          <AlertDescription>
            {effectiveBalance === 0
              ? locale === "fa"
                ? "موجودی کیف پول صفر است. برای خرید پلن یا کانفیگ شارژ کنید."
                : "No balance. Top up to purchase plans or configs."
              : locale === "fa"
                ? "موجودی کیف پول کم است. برای جلوگیری از وقفه آن را شارژ کنید."
                : "Low balance. Top up to avoid service interruption."}
          </AlertDescription>
        </Alert>
      ) : null}

      <PageSection contentClassName="grid gap-4 xl:grid-cols-[360px_1fr]">
        <SectionCard>
          <div className="space-y-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === "fa" ? "موجودی قابل استفاده" : "Available balance"}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {formatToman(effectiveBalance, locale)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "fa" ? "آخرین شارژ" : "Last topped up"}:{" "}
                {formatDate(lastToppedUp, locale)}
              </p>
            </div>
            <Button asChild className="w-full justify-between">
              <Link href={localizePathname("/dashboard/billing/wallet/topup", locale)}>
                <span>{locale === "fa" ? "شارژ کیف پول" : "Top up wallet"}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title={locale === "fa" ? "تاریخچه تراکنش‌ها" : "Transaction history"}
          actions={
            <div className="flex flex-wrap gap-2">
              {(["all", "deposit", "purchase", "charge", "refund"] as WalletFilter[]).map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={filter === item ? "default" : "outline"}
                  onClick={() => setFilter(item)}
                >
                  {item === "all" ? <Filter className="size-3.5" /> : null}
                  {item}
                </Button>
              ))}
            </div>
          }
        >
          {visibleTransactions.length === 0 ? (
            <EmptyState
              title={locale === "fa" ? "تراکنشی وجود ندارد" : "No transactions yet"}
              description={
                locale === "fa"
                  ? "برای شروع کیف پول را شارژ کنید."
                  : "Top up your wallet to get started."
              }
            />
          ) : (
            <div className="space-y-2">
              {visibleTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-2 rounded-xl border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{transaction.label}</p>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt, locale)}
                    </p>
                  </div>
                  <p
                    className={
                      transaction.amount >= 0
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-destructive"
                    }
                  >
                    {transaction.amount >= 0 ? "+" : "-"}
                    {formatToman(Math.abs(transaction.amount), locale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
