"use client"

import Link from "next/link"
import * as React from "react"
import {
  Clock3,
  Info,
  LifeBuoy,
  LoaderCircle,
  MessageCircleReply,
  RefreshCcw,
  SendHorizonal,
} from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { useTickets } from "@/features/tickets/tickets-provider"
import {
  getTicketCategoryLabel,
  TicketPriorityBadge,
  TicketStatusBadge,
  type TicketDetailDemoState,
} from "@/features/tickets/ticket-presenters"
import { formatDate, formatDateTime } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import type { TicketMessageRecord } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

const copy = {
  en: {
    back: "Back to tickets",
    created: "Created",
    errorDescription: "The ticket conversation could not be loaded right now.",
    errorTitle: "Ticket unavailable",
    messagePlaceholder: "Write your reply so support can continue helping.",
    notFoundDescription: "This support ticket could not be found in the local demo data.",
    notFoundTitle: "Ticket not found",
    priority: "Priority",
    reply: "Send reply",
    resolvedHint: "This ticket is resolved. Open a new ticket if the issue returns.",
    sending: "Sending reply...",
    status: "Status",
    supportInfo: "Support replied. Send the requested details to keep the ticket moving.",
    titlePrefix: "Ticket",
    updated: "Updated",
    waitingSupportInfo: "Your message is with support. We’ll show the next reply in this thread.",
  },
  fa: {
    back: "بازگشت به تیکت‌ها",
    created: "ایجاد",
    errorDescription: "بارگذاری گفتگوی تیکت در حال حاضر ممکن نیست.",
    errorTitle: "تیکت در دسترس نیست",
    messagePlaceholder: "پاسخ خود را بنویسید تا پشتیبانی رسیدگی را ادامه دهد.",
    notFoundDescription: "این تیکت در داده‌های محلی دمو پیدا نشد.",
    notFoundTitle: "تیکت پیدا نشد",
    priority: "اولویت",
    reply: "ارسال پاسخ",
    resolvedHint: "این تیکت حل شده است. اگر مشکل برگشت، یک تیکت جدید ثبت کنید.",
    sending: "در حال ارسال پاسخ...",
    status: "وضعیت",
    supportInfo: "پشتیبانی پاسخ داده است. برای ادامه رسیدگی، جزئیات خواسته‌شده را ارسال کنید.",
    titlePrefix: "تیکت",
    updated: "به‌روزرسانی",
    waitingSupportInfo: "پیام شما برای پشتیبانی ارسال شده است. پاسخ بعدی در همین گفتگو نمایش داده می‌شود.",
  },
} as const

function DetailSkeleton() {
  return (
    <DashboardPage title="Ticket" description="Loading support thread">
      <PageSection>
        <SectionCard>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-18 rounded-2xl" />
              <Skeleton className="h-18 rounded-2xl" />
              <Skeleton className="h-18 rounded-2xl" />
            </div>
          </div>
        </SectionCard>
      </PageSection>
      <PageSection>
        <SectionCard>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <Skeleton className="h-24 w-[78%] rounded-2xl" />
              </div>
            ))}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}

function TicketMessageBubble({
  locale,
  message,
}: {
  locale: "en" | "fa"
  message: TicketMessageRecord
}) {
  const isUser = message.authorType === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[82%] ${
          isUser ? "bg-primary text-primary-foreground" : "border bg-background"
        }`}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={isUser ? "text-primary-foreground/80" : "text-muted-foreground"}>
            {message.authorName}
          </span>
          <span className={isUser ? "text-primary-foreground/80" : "text-muted-foreground"}>
            {formatDateTime(message.createdAt, locale)}
          </span>
        </div>
        <p className="text-sm leading-6 whitespace-pre-wrap">{message.body}</p>
      </div>
    </div>
  )
}

export function TicketDetailPage({
  demoState = "default",
  ticketId,
}: {
  demoState?: TicketDetailDemoState
  ticketId: string
}) {
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { addReply, markViewed, tickets } = useTickets()
  const text = copy[locale]
  const ticket = tickets.find((item) => item.id === ticketId) ?? null
  const [replyBody, setReplyBody] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)

  React.useEffect(() => {
    if (ticket) {
      markViewed(ticket.id)
    }
  }, [markViewed, ticket])

  if (demoState === "loading") {
    return <DetailSkeleton />
  }

  if (demoState === "error") {
    return (
      <DashboardPage title={text.errorTitle} description={text.errorDescription}>
        <SectionCard
          actions={
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCcw className="size-4" />
              {locale === "fa" ? "تلاش دوباره" : "Try again"}
            </Button>
          }
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LifeBuoy className="size-4" />
            <span>{text.errorDescription}</span>
          </div>
        </SectionCard>
      </DashboardPage>
    )
  }

  if (!ticket) {
    return (
      <DashboardPage title={text.notFoundTitle} description={text.notFoundDescription}>
        <EmptyState
          title={text.notFoundTitle}
          description={text.notFoundDescription}
          action={
            <Button asChild>
              <Link href={localizePathname("/dashboard/tickets", locale)}>
                {text.back}
              </Link>
            </Button>
          }
        />
      </DashboardPage>
    )
  }

  const replyDisabled = ticket.status === "resolved" || ticket.status === "closed"

  const handleReply = async () => {
    if (!replyBody.trim()) {
      return
    }

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    addReply(ticket.id, replyBody)
    setReplyBody("")
    setIsSending(false)
    addToast(locale === "fa" ? "پاسخ شما ارسال شد." : "Your reply was sent.", "success")
  }

  return (
    <DashboardPage
      title={ticket.subject}
      description={`${text.titlePrefix} ${ticket.id}`}
      actions={
        <Button asChild variant="outline">
          <Link href={localizePathname("/dashboard/tickets", locale)}>{text.back}</Link>
        </Button>
      }
    >
      <PageSection>
        <SectionCard>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <TicketStatusBadge locale={locale} status={ticket.status} />
              <TicketPriorityBadge locale={locale} priority={ticket.priority} />
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {getTicketCategoryLabel(locale, ticket.category)}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/15 px-3.5 py-2.5">
                <p className="text-sm text-muted-foreground">{text.status}</p>
                <p className="mt-1 font-medium">
                  {locale === "fa"
                    ? ticket.status === "waiting_for_user"
                      ? "در انتظار پاسخ شما"
                      : ticket.status === "waiting_for_support"
                        ? "در انتظار پشتیبانی"
                        : ticket.status === "resolved"
                          ? "حل‌شده"
                          : ticket.status === "closed"
                            ? "بسته"
                            : "باز"
                    : ticket.status === "waiting_for_user"
                      ? "Waiting for your reply"
                      : ticket.status === "waiting_for_support"
                        ? "Waiting for support"
                        : ticket.status === "resolved"
                          ? "Resolved"
                          : ticket.status === "closed"
                            ? "Closed"
                            : "Open"}
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/15 px-3.5 py-2.5">
                <p className="text-sm text-muted-foreground">{text.created}</p>
                <p className="mt-1 font-medium">{formatDate(ticket.createdAt, locale)}</p>
              </div>
              <div className="rounded-2xl border bg-muted/15 px-3.5 py-2.5">
                <p className="text-sm text-muted-foreground">{text.updated}</p>
                <p className="mt-1 font-medium">{formatDateTime(ticket.updatedAt, locale)}</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </PageSection>

      <PageSection>
        <SectionCard
          title={locale === "fa" ? "گفتگو" : "Conversation"}
          description={locale === "fa" ? "تمام پیام‌های شما و پشتیبانی در این تیکت" : "All messages between you and support for this ticket"}
        >
          <div className="space-y-3">
            {ticket.status === "waiting_for_user" ? (
              <Alert className="border-primary/30 bg-primary/5">
                <MessageCircleReply className="size-4" />
                <AlertDescription>{text.supportInfo}</AlertDescription>
              </Alert>
            ) : ticket.status === "waiting_for_support" || ticket.status === "open" ? (
              <Alert>
                <Info className="size-4" />
                <AlertDescription>{text.waitingSupportInfo}</AlertDescription>
              </Alert>
            ) : null}

            <ScrollArea className="h-[420px] rounded-2xl border bg-muted/15 p-3">
              <div className="space-y-3 pr-4">
                {ticket.messages.map((message) => (
                  <TicketMessageBubble key={message.id} locale={locale} message={message} />
                ))}
              </div>
            </ScrollArea>

            {replyDisabled ? (
              <div className="rounded-2xl border border-dashed bg-muted/15 px-3.5 py-4 text-sm text-muted-foreground">
                {text.resolvedHint}
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border bg-muted/15 p-3.5">
                <Textarea
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  placeholder={text.messagePlaceholder}
                  className="min-h-28 resize-none"
                />
                <div className="flex justify-end">
                  <Button type="button" onClick={() => void handleReply()} disabled={isSending || !replyBody.trim()}>
                    {isSending ? <LoaderCircle className="animate-spin" /> : <SendHorizonal className="size-4" />}
                    {isSending ? text.sending : text.reply}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
