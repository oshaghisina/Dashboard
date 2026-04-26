export type WalletTransactionType =
  | "deposit"
  | "plan_purchase"
  | "config_charge"
  | "representative_deduction"
  | "refund"

export interface WalletTransaction {
  id: string
  amount: number
  createdAt: string
  label: string
  type: WalletTransactionType
}

export const LOW_WALLET_BALANCE = 50_000

export const walletDemo = {
  balance: 380_000,
  currency: "IRT",
  lastToppedUp: "2026-04-20T10:00:00.000Z",
  transactions: [
    {
      amount: -30_000,
      createdAt: "2026-04-22T12:00:00.000Z",
      id: "wallet_04",
      label: "Rep Charge · Ali Rezaei · Frankfurt",
      type: "representative_deduction",
    },
    {
      amount: 200_000,
      createdAt: "2026-04-20T10:00:00.000Z",
      id: "wallet_03",
      label: "Deposit · Bank Transfer",
      type: "deposit",
    },
    {
      amount: -120_000,
      createdAt: "2026-04-15T09:00:00.000Z",
      id: "wallet_02",
      label: "Plan Purchase · Pro 1 Month",
      type: "plan_purchase",
    },
    {
      amount: 500_000,
      createdAt: "2026-04-10T09:00:00.000Z",
      id: "wallet_01",
      label: "Deposit · Crypto (USDT)",
      type: "deposit",
    },
  ] satisfies WalletTransaction[],
}

export const topUpPresets = [50_000, 100_000, 200_000, 500_000] as const
