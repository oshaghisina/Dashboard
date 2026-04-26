export type DashboardRole = "owner" | "admin" | "editor" | "viewer"

export type AppLocale = "en" | "fa"
export type AppDirection = "ltr" | "rtl"
export type DemoSessionStatus = "anonymous" | "authenticated" | "expired"

export interface DemoUserProfile {
  id: string
  displayName: string
  email: string
  planName: "Free" | "Pro" | "VIP"
  planBadgeTone: "default" | "secondary" | "outline"
  referralCode: string
}

export interface DemoSessionState {
  status: DemoSessionStatus
  user: DemoUserProfile | null
}

export interface RecentActivityRecord {
  id: string
  timestamp: string
  location: string
  type: string
}

export interface SubscriptionSummary {
  planName: "Free" | "Pro" | "VIP"
  status: "active" | "expiring" | "expired" | "none" | "cancelling"
  daysRemaining: number | null
  expiresAt: string | null
  autoRenew: boolean
  usedGb: number
  totalGb: number | null
}

export interface UsageSummary {
  usedGb: number
  totalGb: number | null
  remainingGb: number | null
  sessionsThisMonth: number
  unlimited: boolean
  percentageUsed: number
}

export interface UsageBreakdown {
  uploadGb: number
  downloadGb: number
  overheadGb: number
  estimatedDaysRemaining: number | null
}

export interface UsagePoint {
  label: string
  usageGb: number
  sessions: number
}

export interface SessionRecord {
  id: string
  startedAt: string
  location: string
  uploadGb: number
  downloadGb: number
  durationLabel: string
  active: boolean
}

export interface DeviceRecord {
  id: string
  name: string
  kind: "desktop" | "laptop" | "phone" | "unknown"
  lastSeen: string
  location: string
  protocol: "VMess" | "VLESS" | "Trojan"
  active: boolean
}

export interface ConfigProfile {
  id: string
  name: string
  subscriptionId: string
  protocol: "VMess" | "VLESS" | "Trojan"
  server: string
  location: string
  secureTransport: "TLS" | "WS" | "gRPC"
  status: "active" | "expired" | "locked"
  lastUpdated: string
  uploadedLabel: string
  downloadedLabel: string
  usageLabel: string
  totalQuotaLabel: string
  remainedLabel: string
  expiryLabel: string
  lastOnline: string
  configUrl: string
  rawConfig: string
}

export interface PlanOption {
  id: string
  name: "Free" | "Pro" | "VIP"
  monthlyPrice: number
  yearlyPrice: number
  quarterlyPrice: number
  dataAllowance: string
  configLimit: string
  deviceLimit: string
  supportLabel: string
  popular?: boolean
}

export interface InvoiceRecord {
  id: string
  date: string
  planName: string
  cycleLabel: string
  amount: number
  paymentMethod: string
  txid?: string
}

export interface CheckoutState {
  planId: string
  cycle: "monthly" | "quarterly" | "yearly"
  paymentMethod: "card" | "crypto" | "bank"
  promoCode: string
  appliedPromoCode: string | null
  status: "idle" | "processing" | "success" | "error"
  errorMessage?: string
}

export interface NotificationRecord {
  id: string
  title: string
  body: string
  createdAt: string
  category: "billing" | "usage" | "config" | "system"
  unread: boolean
  ctaLabel?: string
  ctaHref?: string
}

export interface NotificationPreferenceState {
  quotaAlerts: { email: boolean; inApp: boolean }
  expiryReminders: { email: boolean; inApp: boolean }
  paymentReceipts: { email: boolean; inApp: boolean }
  configChanges: { email: boolean; inApp: boolean }
  securityAlerts: { email: boolean; inApp: boolean }
}

export interface ReferralSummary {
  code: string
  referralLink: string
  referredCount: number
  convertedCount: number
  earnedAmount: number
}

export interface ReferralHistoryRecord {
  id: string
  emailMasked: string
  date: string
  status: "signed_up" | "paid" | "pending"
  rewardLabel: string
}

export interface ReferralCodeValidationState {
  state:
    | "collapsed"
    | "empty"
    | "typing"
    | "valid"
    | "invalid"
    | "locked"
}

export type TicketCategory =
  | "connection_issue"
  | "config_help"
  | "billing"
  | "refund"
  | "account_access"
  | "app_setup"
  | "other"

export type TicketPriority = "low" | "normal" | "high"

export type TicketStatus =
  | "open"
  | "waiting_for_support"
  | "waiting_for_user"
  | "resolved"
  | "closed"

export type TicketAuthorType = "user" | "support"

export interface TicketMessageRecord {
  id: string
  authorType: TicketAuthorType
  authorName: string
  body: string
  createdAt: string
}

export interface TicketRecord {
  id: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  requesterName: string
  lastReplyPreview: string
  lastReplyAuthorType: TicketAuthorType
  unread: boolean
  messages: TicketMessageRecord[]
}

export interface TicketSummaryCounts {
  open: number
  waiting: number
  resolved: number
}

export interface TicketFilters {
  status?: TicketStatus | "all"
  category?: TicketCategory | "all"
}
