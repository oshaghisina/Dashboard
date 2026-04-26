"use client"

import Link from "next/link"
import * as React from "react"
import { ArrowUpRight, LifeBuoy, MessageCircleMore, RefreshCcw } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useTickets } from "@/features/tickets/tickets-provider"
import {
  getTicketCategoryLabel,
  getTicketLastReplyLabel,
  TicketPriorityBadge,
  TicketStatusBadge,
  type TicketsListDemoState,
} from "@/features/tickets/ticket-presenters"
import { formatDateTime } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import type { TicketCategory, TicketRecord, TicketStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

const categories: TicketCategory[] = [
  "connection_issue",
  "config_help",
  "billing",
  "refund",
  "account_access",
  "app_setup",
  "other",
]

const copy = {
  en: {
    description: "Create support requests, track replies, and see what needs your attention.",
    emptyDescription: "You have no support tickets yet. Create one when you need help with configs, billing, or access.",
    emptyTitle: "No tickets yet",
    errorDescription: "The support inbox could not be loaded right now.",
    errorTitle: "Ticket list unavailable",
    newTicket: "New ticket",
    open: "Open",
    pageTitle: "Support tickets",
    resolved: "Resolved",
    retry: "Try again",
    statusAll: "All statuses",
    statusLabel: "Status",
    updated: "Updated",
    waiting: "Waiting",
    waitingHint: "Needs your reply",
    categoryAll: "All categories",
    categoryLabel: "Category",
  },
  fa: {
    description: "درخواست‌های پشتیبانی را ثبت کنید، پاسخ‌ها را ببینید و موارد نیازمند توجه را دنبال کنید.",
    emptyDescription: "هنوز تیکتی ثبت نکرده‌اید. هر زمان برای کانفیگ، پرداخت یا دسترسی نیاز به کمک داشتید یک تیکت جدید بسازید.",
    emptyTitle: "هنوز تیکتی ندارید",
    errorDescription: "بارگذاری صندوق پشتیبانی در حال حاضر ممکن نیست.",
    errorTitle: "فهرست تیکت‌ها در دسترس نیست",
    newTicket: "تیکت جدید",
    open: "باز",
    pageTitle: "تیکت‌های پشتیبانی",
    resolved: "حل‌شده",
    retry: "تلاش دوباره",
    statusAll: "همه وضعیت‌ها",
    statusLabel: "وضعیت",
    updated: "به‌روزرسانی",
    waiting: "در انتظار شما",
    waitingHint: "نیازمند پاسخ شما",
    categoryAll: "همه دسته‌ها",
    categoryLabel: "دسته‌بندی",
  },
} as const

function TicketListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-44" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
            <div className="space-y-2 sm:w-40">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TicketRow({
  locale,
  ticket,
}: {
  locale: "en" | "fa"
  ticket: TicketRecord
}) {
  const needsAttention = ticket.status === "waiting_for_user" || ticket.unread

  return (
    <Link
      href={localizePathname(`/dashboard/tickets/${ticket.id}`, locale)}
      className={`dashboard-hover-lift block rounded-2xl border p-4 hover:border-primary/40 hover:bg-accent/30 ${
        needsAttention ? "border-primary/35 bg-primary/5" : ""
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium">{ticket.subject}</p>
              {ticket.unread ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                  {locale === "fa" ? "جدید" : "New"}
                </span>
              ) : null}
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {ticket.lastReplyPreview}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge locale={locale} status={ticket.status} />
            <TicketPriorityBadge locale={locale} priority={ticket.priority} />
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {getTicketCategoryLabel(locale, ticket.category)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:w-48">
          <div className="space-y-1 text-xs text-muted-foreground sm:text-right">
            <p>{getTicketLastReplyLabel(locale, ticket.lastReplyAuthorType, ticket.status)}</p>
            <p>{formatDateTime(ticket.updatedAt, locale)}</p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground sm:mt-2 sm:ml-auto" />
        </div>
      </div>
    </Link>
  )
}

export function TicketsPage({
  demoState = "default",
}: {
  demoState?: TicketsListDemoState
}) {
  const { locale } = useLocaleContext()
  const { tickets } = useTickets()
  const text = copy[locale]
  const [statusFilter, setStatusFilter] = React.useState<TicketStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = React.useState<TicketCategory | "all">("all")

  const ticketSource =
    demoState === "empty" ? [] : tickets

  const visibleTickets = ticketSource.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false
    }

    if (categoryFilter !== "all" && ticket.category !== categoryFilter) {
      return false
    }

    return true
  })

  const summaryCounts = tickets.reduce(
    (accumulator, ticket) => {
      if (ticket.status === "open" || ticket.status === "waiting_for_support") {
        accumulator.open += 1
      }

      if (ticket.status === "waiting_for_user") {
        accumulator.waiting += 1
      }

      if (ticket.status === "resolved") {
        accumulator.resolved += 1
      }

      return accumulator
    },
    { open: 0, resolved: 0, waiting: 0 }
  )

  return (
    <DashboardPage title={text.pageTitle} description={text.description}>
      <PageSection>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">{text.open}</p>
            <p className="mt-1 text-xl font-semibold">{summaryCounts.open}</p>
          </div>
          <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">{text.waiting}</p>
            <p className="mt-1 text-xl font-semibold">{summaryCounts.waiting}</p>
            <p className="mt-1 text-xs text-muted-foreground">{text.waitingHint}</p>
          </div>
          <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">{text.resolved}</p>
            <p className="mt-1 text-xl font-semibold">{summaryCounts.resolved}</p>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <FilterBar
          actions={
            <Button asChild>
              <Link href={localizePathname("/dashboard/tickets/new", locale)}>
                {text.newTicket}
              </Link>
            </Button>
          }
        >
          <div className="w-full sm:w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue placeholder={text.statusLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text.statusAll}</SelectItem>
                <SelectItem value="open">{locale === "fa" ? "باز" : "Open"}</SelectItem>
                <SelectItem value="waiting_for_support">
                  {locale === "fa" ? "در انتظار پشتیبانی" : "Waiting for support"}
                </SelectItem>
                <SelectItem value="waiting_for_user">
                  {locale === "fa" ? "در انتظار پاسخ شما" : "Waiting for your reply"}
                </SelectItem>
                <SelectItem value="resolved">{text.resolved}</SelectItem>
                <SelectItem value="closed">{locale === "fa" ? "بسته" : "Closed"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[220px]">
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as TicketCategory | "all")}
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue placeholder={text.categoryLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text.categoryAll}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getTicketCategoryLabel(locale, category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FilterBar>
      </PageSection>

      <PageSection>
        {demoState === "loading" ? (
          <SectionCard title={text.pageTitle}>
            <TicketListSkeleton />
          </SectionCard>
        ) : demoState === "error" ? (
          <SectionCard
            title={text.errorTitle}
            description={text.errorDescription}
            actions={
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCcw className="size-4" />
                {text.retry}
              </Button>
            }
          >
            <div className="flex items-center gap-2 rounded-xl border border-dashed bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
              <LifeBuoy className="size-4" />
              <span>{text.errorDescription}</span>
            </div>
          </SectionCard>
        ) : visibleTickets.length === 0 ? (
          <EmptyState
            title={text.emptyTitle}
            description={text.emptyDescription}
            action={
              <Button asChild>
                <Link href={localizePathname("/dashboard/tickets/new", locale)}>
                  {text.newTicket}
                </Link>
              </Button>
            }
          />
        ) : (
          <SectionCard title={text.pageTitle}>
            <div className="space-y-3">
              {visibleTickets.map((ticket) => (
                <TicketRow key={ticket.id} locale={locale} ticket={ticket} />
              ))}
            </div>
          </SectionCard>
        )}
      </PageSection>
    </DashboardPage>
  )
}
