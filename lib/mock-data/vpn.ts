import type {
  ConfigProfile,
  DemoUserProfile,
  DeviceRecord,
  InvoiceRecord,
  NotificationPreferenceState,
  NotificationRecord,
  PlanOption,
  RecentActivityRecord,
  ReferralHistoryRecord,
  ReferralSummary,
  SessionRecord,
  SubscriptionSummary,
  UsageBreakdown,
  UsagePoint,
  UsageSummary,
} from "@/lib/types"

export const demoUserProfile: DemoUserProfile = {
  id: "user_sina",
  displayName: "Sina Oshaghi",
  email: "sina@example.com",
  planName: "Pro",
  planBadgeTone: "secondary",
  referralCode: "SINA42",
}

export const subscriptionSummary: SubscriptionSummary = {
  autoRenew: false,
  daysRemaining: 18,
  expiresAt: "2026-04-29T12:00:00.000Z",
  planName: "Pro",
  status: "active",
  totalGb: 100,
  usedGb: 42.3,
}

export const recentActivity: RecentActivityRecord[] = [
  {
    id: "activity_1",
    location: "Frankfurt",
    timestamp: "2026-04-11T09:14:00.000Z",
    type: "Connected",
  },
  {
    id: "activity_2",
    location: "Amsterdam",
    timestamp: "2026-04-10T22:01:00.000Z",
    type: "Connected",
  },
  {
    id: "activity_3",
    location: "Frankfurt",
    timestamp: "2026-04-08T18:20:00.000Z",
    type: "Connected",
  },
]

export const usageSummary: UsageSummary = {
  percentageUsed: 42.3,
  remainingGb: 57.7,
  sessionsThisMonth: 28,
  totalGb: 100,
  unlimited: false,
  usedGb: 42.3,
}

export const usageBreakdown: UsageBreakdown = {
  downloadGb: 29.9,
  estimatedDaysRemaining: 14,
  overheadGb: 2.1,
  uploadGb: 12.4,
}

export const usageSeries: UsagePoint[] = [
  { label: "Apr 1", usageGb: 1.6, sessions: 1 },
  { label: "Apr 3", usageGb: 3.2, sessions: 2 },
  { label: "Apr 5", usageGb: 4.5, sessions: 3 },
  { label: "Apr 7", usageGb: 5.3, sessions: 4 },
  { label: "Apr 9", usageGb: 6.1, sessions: 6 },
  { label: "Apr 11", usageGb: 8.4, sessions: 7 },
]

export const sessionHistory: SessionRecord[] = [
  {
    active: true,
    downloadGb: 8.4,
    durationLabel: "1h 23m",
    id: "session_1",
    location: "Frankfurt (DE)",
    startedAt: "2026-04-11T09:14:00.000Z",
    uploadGb: 2.1,
  },
  {
    active: false,
    downloadGb: 3.2,
    durationLabel: "45m",
    id: "session_2",
    location: "Amsterdam (NL)",
    startedAt: "2026-04-10T22:01:00.000Z",
    uploadGb: 0.4,
  },
  {
    active: false,
    downloadGb: 7.1,
    durationLabel: "2h 10m",
    id: "session_3",
    location: "Frankfurt (DE)",
    startedAt: "2026-04-10T14:33:00.000Z",
    uploadGb: 1.8,
  },
]

export const devices: DeviceRecord[] = [
  {
    active: true,
    id: "device_1",
    kind: "phone",
    lastSeen: "just now",
    location: "Frankfurt",
    name: "iPhone 14",
    protocol: "VMess",
  },
  {
    active: false,
    id: "device_2",
    kind: "laptop",
    lastSeen: "2h ago",
    location: "Amsterdam",
    name: "MacBook Pro",
    protocol: "VLESS",
  },
  {
    active: false,
    id: "device_3",
    kind: "desktop",
    lastSeen: "yesterday",
    location: "Frankfurt",
    name: "Desktop (Unknown)",
    protocol: "Trojan",
  },
]

export const configProfiles: ConfigProfile[] = [
  {
    configUrl: "vmess://tunnel-demo-frankfurt",
    downloadedLabel: "415.47 MB",
    expiryLabel: "No expiry",
    id: "config_frankfurt",
    lastUpdated: "2026-04-10T18:00:00.000Z",
    lastOnline: "2026-04-11T20:29:33.000Z",
    location: "Frankfurt",
    name: "Primary Frankfurt",
    protocol: "VMess",
    rawConfig:
      '{"v":"2","ps":"Frankfurt","add":"frankfurt.tunnel.app","port":"443","id":"8c3a-demo","aid":"0","net":"ws","type":"none","host":"frankfurt.tunnel.app","path":"/vpn","tls":"tls"}',
    remainedLabel: "4.55 GB",
    secureTransport: "TLS",
    server: "frankfurt.tunnel.app",
    status: "active",
    subscriptionId: "xmt2rxbmesaamf7a",
    totalQuotaLabel: "5.00 GB",
    uploadedLabel: "41.05 MB",
    usageLabel: "456.52 MB",
  },
  {
    configUrl: "vless://tunnel-demo-amsterdam",
    downloadedLabel: "1.12 GB",
    expiryLabel: "May 14, 2026",
    id: "config_amsterdam",
    lastUpdated: "2026-04-08T14:00:00.000Z",
    lastOnline: "2026-04-10T22:01:00.000Z",
    location: "Amsterdam",
    name: "Backup Amsterdam",
    protocol: "VLESS",
    rawConfig:
      "vless://8c3a-demo@ams.tunnel.app:443?security=tls&type=grpc&serviceName=tunnel#Amsterdam",
    remainedLabel: "8.31 GB",
    secureTransport: "gRPC",
    server: "ams.tunnel.app",
    status: "active",
    subscriptionId: "y5n4backupamsterdam",
    totalQuotaLabel: "10.00 GB",
    uploadedLabel: "186.40 MB",
    usageLabel: "1.30 GB",
  },
  {
    configUrl: "trojan://tunnel-demo-tokyo",
    downloadedLabel: "0 MB",
    expiryLabel: "Expired",
    id: "config_tokyo",
    lastUpdated: "2026-03-28T11:30:00.000Z",
    lastOnline: "2026-03-28T11:30:00.000Z",
    location: "Tokyo",
    name: "VIP Tokyo",
    protocol: "Trojan",
    rawConfig: "trojan://token@tokyo.tunnel.app:443?security=tls#Tokyo",
    remainedLabel: "0 GB",
    secureTransport: "TLS",
    server: "tokyo.tunnel.app",
    status: "locked",
    subscriptionId: "viptokyoarchive01",
    totalQuotaLabel: "Unlimited",
    uploadedLabel: "0 MB",
    usageLabel: "0 MB",
  },
]

export const planOptions: PlanOption[] = [
  {
    configLimit: "1 config",
    dataAllowance: "5 GB / mo",
    deviceLimit: "1 device",
    id: "free",
    monthlyPrice: 0,
    name: "Free",
    quarterlyPrice: 0,
    supportLabel: "Community support",
    yearlyPrice: 0,
  },
  {
    configLimit: "3 configs",
    dataAllowance: "100 GB / mo",
    deviceLimit: "5 devices",
    id: "pro",
    monthlyPrice: 9.99,
    name: "Pro",
    popular: true,
    quarterlyPrice: 26.97,
    supportLabel: "Priority support",
    yearlyPrice: 89.9,
  },
  {
    configLimit: "10 configs",
    dataAllowance: "Unlimited",
    deviceLimit: "Unlimited",
    id: "vip",
    monthlyPrice: 19.99,
    name: "VIP",
    quarterlyPrice: 53.97,
    supportLabel: "Dedicated support",
    yearlyPrice: 179.9,
  },
]

export const invoices: InvoiceRecord[] = [
  {
    amount: 9.99,
    cycleLabel: "1 month",
    date: "2026-04-01T09:00:00.000Z",
    id: "TUN-2026-0411-001",
    paymentMethod: "Visa ****4242",
    planName: "Pro",
  },
  {
    amount: 9.99,
    cycleLabel: "1 month",
    date: "2026-03-01T09:00:00.000Z",
    id: "TUN-2026-0301-001",
    paymentMethod: "Visa ****4242",
    planName: "Pro",
  },
]

export const referralSummary: ReferralSummary = {
  code: "SINA42",
  convertedCount: 7,
  earnedAmount: 14,
  referredCount: 12,
  referralLink: "https://tunnel.app/join/SINA42",
}

export const referralHistory: ReferralHistoryRecord[] = [
  {
    date: "2026-04-10T09:00:00.000Z",
    emailMasked: "a***@gmail.com",
    id: "ref_1",
    rewardLabel: "—",
    status: "signed_up",
  },
  {
    date: "2026-04-08T09:00:00.000Z",
    emailMasked: "b***@yahoo.com",
    id: "ref_2",
    rewardLabel: "+$2.00",
    status: "paid",
  },
  {
    date: "2026-03-20T09:00:00.000Z",
    emailMasked: "d***@email.com",
    id: "ref_3",
    rewardLabel: "Pending",
    status: "pending",
  },
]

export const initialNotifications: NotificationRecord[] = [
  {
    body: "You have used 80 GB of 100 GB.",
    category: "usage",
    createdAt: "2026-04-11T11:00:00.000Z",
    ctaHref: "/dashboard/billing/plans",
    ctaLabel: "Upgrade plan",
    id: "notif_1",
    title: "Data usage at 80%",
    unread: true,
  },
  {
    body: "Pro plan renewed for 1 month.",
    category: "billing",
    createdAt: "2026-04-10T09:00:00.000Z",
    ctaHref: "/dashboard/billing/invoices/TUN-2026-0411-001",
    ctaLabel: "View receipt",
    id: "notif_2",
    title: "Payment confirmed",
    unread: false,
  },
  {
    body: "Frankfurt config profile updated.",
    category: "config",
    createdAt: "2026-04-08T08:00:00.000Z",
    id: "notif_3",
    title: "Config updated",
    unread: false,
  },
]

export const notificationPreferences: NotificationPreferenceState = {
  configChanges: { email: false, inApp: true },
  expiryReminders: { email: true, inApp: true },
  paymentReceipts: { email: true, inApp: true },
  quotaAlerts: { email: true, inApp: true },
  securityAlerts: { email: true, inApp: true },
}

export const referralLanding = {
  avatarLabel: "SO",
  firstName: "Sina",
  reward: "20% off your first plan",
}
