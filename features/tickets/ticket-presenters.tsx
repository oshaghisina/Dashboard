import { Badge } from "@/components/ui/badge"
import type {
  AppLocale,
  TicketAuthorType,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/types"

export type TicketsListDemoState = "default" | "loading" | "empty" | "error"
export type TicketDetailDemoState = "default" | "loading" | "error"

export function parseTicketsListDemoState(
  value: string | undefined
): TicketsListDemoState {
  switch (value) {
    case "loading":
    case "empty":
    case "error":
      return value
    default:
      return "default"
  }
}

export function parseTicketDetailDemoState(
  value: string | undefined
): TicketDetailDemoState {
  switch (value) {
    case "loading":
    case "error":
      return value
    default:
      return "default"
  }
}

const categoryLabels: Record<TicketCategory, Record<AppLocale, string>> = {
  account_access: { en: "Account access", fa: "دسترسی حساب" },
  app_setup: { en: "App setup", fa: "راه‌اندازی اپ" },
  billing: { en: "Billing", fa: "پرداخت" },
  config_help: { en: "Config help", fa: "راهنمای کانفیگ" },
  connection_issue: { en: "Connection issue", fa: "مشکل اتصال" },
  other: { en: "Other", fa: "سایر" },
  refund: { en: "Refund", fa: "بازگشت وجه" },
}

const priorityLabels: Record<TicketPriority, Record<AppLocale, string>> = {
  high: { en: "High", fa: "بالا" },
  low: { en: "Low", fa: "پایین" },
  normal: { en: "Normal", fa: "معمولی" },
}

const statusLabels: Record<TicketStatus, Record<AppLocale, string>> = {
  closed: { en: "Closed", fa: "بسته" },
  open: { en: "Open", fa: "باز" },
  resolved: { en: "Resolved", fa: "حل‌شده" },
  waiting_for_support: { en: "Waiting for support", fa: "در انتظار پشتیبانی" },
  waiting_for_user: { en: "Waiting for your reply", fa: "در انتظار پاسخ شما" },
}

export function getTicketCategoryLabel(
  locale: AppLocale,
  category: TicketCategory
) {
  return categoryLabels[category][locale]
}

export function getTicketPriorityLabel(
  locale: AppLocale,
  priority: TicketPriority
) {
  return priorityLabels[priority][locale]
}

export function getTicketStatusLabel(locale: AppLocale, status: TicketStatus) {
  return statusLabels[status][locale]
}

export function getTicketLastReplyLabel(
  locale: AppLocale,
  authorType: TicketAuthorType,
  status: TicketStatus
) {
  if (status === "waiting_for_user" && authorType === "support") {
    return locale === "fa" ? "پشتیبانی پاسخ داده است" : "Support replied"
  }

  if (status === "waiting_for_support" || (status === "open" && authorType === "user")) {
    return locale === "fa" ? "در انتظار پاسخ پشتیبانی" : "Awaiting support"
  }

  if (status === "resolved") {
    return locale === "fa" ? "حل‌شده" : "Resolved"
  }

  if (status === "closed") {
    return locale === "fa" ? "بسته" : "Closed"
  }

  return authorType === "support"
    ? locale === "fa"
      ? "آخرین پاسخ از پشتیبانی"
      : "Last reply from support"
    : locale === "fa"
      ? "آخرین پاسخ از شما"
      : "Last reply from you"
}

export function TicketStatusBadge({
  locale,
  status,
}: {
  locale: AppLocale
  status: TicketStatus
}) {
  const className =
    status === "waiting_for_user"
      ? "bg-primary text-primary-foreground"
      : status === "waiting_for_support"
        ? "bg-amber-500 text-amber-950"
        : status === "resolved"
          ? "bg-emerald-500 text-white"
          : status === "closed"
            ? "bg-muted text-muted-foreground"
            : "bg-secondary text-secondary-foreground"

  return <Badge className={className}>{getTicketStatusLabel(locale, status)}</Badge>
}

export function TicketPriorityBadge({
  locale,
  priority,
}: {
  locale: AppLocale
  priority: TicketPriority
}) {
  const variant =
    priority === "high"
      ? "default"
      : priority === "normal"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{getTicketPriorityLabel(locale, priority)}</Badge>
}
