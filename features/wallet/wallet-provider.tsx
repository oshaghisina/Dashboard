"use client"

import * as React from "react"

import {
  type WalletTransaction,
  type WalletTransactionType,
  walletDemo,
} from "@/features/wallet/wallet-data"

interface WalletMutationInput {
  amount: number
  label: string
  type: WalletTransactionType
}

interface WalletContextValue {
  addCredit: (input: WalletMutationInput) => WalletTransaction
  addDebit: (input: WalletMutationInput) => WalletTransaction | null
  balance: number
  lastToppedUp: string
  transactions: WalletTransaction[]
}

const WalletContext = React.createContext<WalletContextValue | null>(null)

function createTransaction(input: WalletMutationInput): WalletTransaction {
  return {
    amount: input.type === "deposit" || input.type === "refund"
      ? Math.abs(input.amount)
      : -Math.abs(input.amount),
    createdAt: new Date().toISOString(),
    id: `wallet_${crypto.randomUUID()}`,
    label: input.label,
    type: input.type,
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = React.useState(walletDemo.balance)
  const [lastToppedUp, setLastToppedUp] = React.useState(walletDemo.lastToppedUp)
  const [transactions, setTransactions] = React.useState<WalletTransaction[]>(
    () => walletDemo.transactions.map((transaction) => ({ ...transaction }))
  )

  const addCredit = React.useCallback((input: WalletMutationInput) => {
    const transaction = createTransaction(input)
    setBalance((current) => current + Math.abs(input.amount))
    setLastToppedUp(transaction.createdAt)
    setTransactions((current) => [transaction, ...current])
    return transaction
  }, [])

  const addDebit = React.useCallback((input: WalletMutationInput) => {
    let transaction: WalletTransaction | null = null

    setBalance((current) => {
      const amount = Math.abs(input.amount)

      if (current < amount) {
        return current
      }

      transaction = createTransaction(input)
      return current - amount
    })

    if (transaction) {
      setTransactions((current) => [transaction!, ...current])
    }

    return transaction
  }, [])

  return (
    <WalletContext.Provider
      value={{
        addCredit,
        addDebit,
        balance,
        lastToppedUp,
        transactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = React.useContext(WalletContext)

  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }

  return context
}
