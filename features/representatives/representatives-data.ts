export type RepUserStatus = "active" | "expiring" | "inactive"
export type RepConfigStatus = "active" | "expiring" | "expired"
export type RepDuration = "1_week" | "1_month" | "3_months" | "6_months" | "1_year"
export type RepDataCap = "20_gb" | "50_gb" | "100_gb" | "unlimited"

export interface RepConfig {
  id: string
  dataCapGb: number | null
  expiresAt: string
  server: string
  status: RepConfigStatus
  totalGb: number | null
  usedGb: number
}

export interface RepUser {
  id: string
  contact: string
  joinedAt: string
  name: string
  notes?: string
  status: RepUserStatus
  usage: {
    lastActive: string
    sessions: number
    totalGb: number
  }
  configs: RepConfig[]
}

export const representativeServers = [
  "Frankfurt · VMess",
  "Amsterdam · VLESS",
  "Tokyo · Trojan",
  "Dubai · VLESS",
] as const

export const durationOptions: { label: string; months: number; value: RepDuration }[] = [
  { label: "1 Week", months: 0.25, value: "1_week" },
  { label: "1 Month", months: 1, value: "1_month" },
  { label: "3 Months", months: 3, value: "3_months" },
  { label: "6 Months", months: 6, value: "6_months" },
  { label: "1 Year", months: 12, value: "1_year" },
]

export const dataCapOptions: { gb: number | null; label: string; value: RepDataCap }[] = [
  { gb: 20, label: "20 GB", value: "20_gb" },
  { gb: 50, label: "50 GB", value: "50_gb" },
  { gb: 100, label: "100 GB", value: "100_gb" },
  { gb: null, label: "Unlimited", value: "unlimited" },
]

export const representativeDemo = {
  users: [
    {
      configs: [
        {
          dataCapGb: 100,
          expiresAt: "2026-05-10T12:00:00.000Z",
          id: "c-01",
          server: "Frankfurt · VMess",
          status: "active",
          totalGb: 100,
          usedGb: 22,
        },
        {
          dataCapGb: 100,
          expiresAt: "2026-04-30T12:00:00.000Z",
          id: "c-02",
          server: "Amsterdam · VLESS",
          status: "expiring",
          totalGb: 100,
          usedGb: 16,
        },
      ],
      contact: "ali@example.com",
      id: "u-01",
      joinedAt: "2026-04-05T09:00:00.000Z",
      name: "Ali Rezaei",
      notes: "Prefers Frankfurt configs.",
      status: "expiring",
      usage: { lastActive: "2026-04-25T14:32:00.000Z", sessions: 47, totalGb: 38 },
    },
    {
      configs: [
        {
          dataCapGb: 50,
          expiresAt: "2026-05-01T12:00:00.000Z",
          id: "c-03",
          server: "Amsterdam · VLESS",
          status: "active",
          totalGb: 50,
          usedGb: 12,
        },
      ],
      contact: "09121234567",
      id: "u-02",
      joinedAt: "2026-04-09T09:00:00.000Z",
      name: "Sara Mohammadi",
      status: "active",
      usage: { lastActive: "2026-04-26T10:10:00.000Z", sessions: 19, totalGb: 12 },
    },
    {
      configs: [],
      contact: "reza@example.com",
      id: "u-03",
      joinedAt: "2026-04-11T09:00:00.000Z",
      name: "Reza Karimi",
      status: "inactive",
      usage: { lastActive: "2026-04-11T09:00:00.000Z", sessions: 0, totalGb: 0 },
    },
  ] satisfies RepUser[],
}

export function calculateRepCost(duration: RepDuration, dataCap: RepDataCap) {
  const durationMonths = durationOptions.find((item) => item.value === duration)?.months ?? 1
  const cap = dataCapOptions.find((item) => item.value === dataCap)
  const capBase = cap?.gb === null ? 75_000 : ((cap?.gb ?? 100) / 100) * 30_000

  return Math.round(capBase * durationMonths)
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + Math.round(months * 30))
  return next
}
