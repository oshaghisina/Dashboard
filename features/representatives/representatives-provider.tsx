"use client"

import * as React from "react"

import { useWallet } from "@/features/wallet/wallet-provider"
import {
  addMonths,
  calculateRepCost,
  dataCapOptions,
  durationOptions,
  type RepConfig,
  type RepDataCap,
  type RepDuration,
  type RepUser,
  representativeDemo,
} from "@/features/representatives/representatives-data"

interface CreateUserInput {
  contact: string
  name: string
  notes?: string
}

interface AssignConfigInput {
  dataCap: RepDataCap
  duration: RepDuration
  server: string
  userId: string
}

interface ExtendConfigInput {
  addData: RepDataCap
  configId: string
  duration: RepDuration
  userId: string
}

interface RepresentativesContextValue {
  assignConfig: (input: AssignConfigInput) => { ok: true } | { ok: false; reason: "insufficient_funds" }
  createUser: (input: CreateUserInput) => RepUser
  extendConfig: (input: ExtendConfigInput) => { ok: true } | { ok: false; reason: "insufficient_funds" }
  users: RepUser[]
}

const RepresentativesContext =
  React.createContext<RepresentativesContextValue | null>(null)

function cloneUsers() {
  return representativeDemo.users.map((user) => ({
    ...user,
    configs: user.configs.map((config) => ({ ...config })),
    usage: { ...user.usage },
  }))
}

function getDataCapGb(value: RepDataCap) {
  return dataCapOptions.find((item) => item.value === value)?.gb ?? 100
}

function getDurationMonths(value: RepDuration) {
  return durationOptions.find((item) => item.value === value)?.months ?? 1
}

export function RepresentativesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [users, setUsers] = React.useState<RepUser[]>(() => cloneUsers())
  const { addDebit } = useWallet()

  const createUser = React.useCallback((input: CreateUserInput) => {
    const now = new Date().toISOString()
    const user: RepUser = {
      configs: [],
      contact: input.contact.trim(),
      id: `u-${crypto.randomUUID()}`,
      joinedAt: now,
      name: input.name.trim(),
      notes: input.notes?.trim(),
      status: "inactive",
      usage: { dailyUsage: [], lastActive: now, sessions: 0, totalGb: 0 },
    }

    setUsers((current) => [user, ...current])
    return user
  }, [])

  const assignConfig = React.useCallback(
    (input: AssignConfigInput) => {
      const cost = calculateRepCost(input.duration, input.dataCap)
      const transaction = addDebit({
        amount: cost,
        label: `Rep Charge · ${input.server}`,
        type: "representative_deduction",
      })

      if (!transaction) {
        return { ok: false as const, reason: "insufficient_funds" as const }
      }

      const capGb = getDataCapGb(input.dataCap)
      const expiresAt = addMonths(new Date(), getDurationMonths(input.duration)).toISOString()
      const config: RepConfig = {
        dataCapGb: capGb,
        expiresAt,
        id: `c-${crypto.randomUUID()}`,
        server: input.server,
        status: "active",
        totalGb: capGb,
        usedGb: 0,
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === input.userId
            ? { ...user, configs: [config, ...user.configs], status: "active" }
            : user
        )
      )

      return { ok: true as const }
    },
    [addDebit]
  )

  const extendConfig = React.useCallback(
    (input: ExtendConfigInput) => {
      const cost = Math.max(10_000, Math.round(calculateRepCost(input.duration, input.addData) / 2))
      const transaction = addDebit({
        amount: cost,
        label: "Rep Charge · Config extension",
        type: "representative_deduction",
      })

      if (!transaction) {
        return { ok: false as const, reason: "insufficient_funds" as const }
      }

      const addedGb = getDataCapGb(input.addData)
      const durationMonths = getDurationMonths(input.duration)

      setUsers((current) =>
        current.map((user) =>
          user.id === input.userId
            ? {
                ...user,
                configs: user.configs.map((config) =>
                  config.id === input.configId
                    ? {
                        ...config,
                        dataCapGb:
                          config.dataCapGb === null || addedGb === null
                            ? null
                            : config.dataCapGb + addedGb,
                        expiresAt: addMonths(new Date(config.expiresAt), durationMonths).toISOString(),
                        totalGb:
                          config.totalGb === null || addedGb === null
                            ? null
                            : config.totalGb + addedGb,
                        status: "active",
                      }
                    : config
                ),
              }
            : user
        )
      )

      return { ok: true as const }
    },
    [addDebit]
  )

  return (
    <RepresentativesContext.Provider
      value={{
        assignConfig,
        createUser,
        extendConfig,
        users,
      }}
    >
      {children}
    </RepresentativesContext.Provider>
  )
}

export function useRepresentatives() {
  const context = React.useContext(RepresentativesContext)

  if (!context) {
    throw new Error("useRepresentatives must be used within RepresentativesProvider")
  }

  return context
}
