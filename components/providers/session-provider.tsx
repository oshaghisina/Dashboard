"use client"

import * as React from "react"

import { DEMO_PASSWORD, DEMO_SESSION_COOKIE } from "@/lib/app-constants"
import type { DemoSessionState, DemoUserProfile } from "@/lib/types"
import { demoUserProfile } from "@/lib/mock-data/vpn"

type LoginOutcome =
  | { ok: true }
  | { ok: false; reason: "locked" | "unverified" | "wrong_credentials" }

type SignupOutcome =
  | { ok: true }
  | { ok: false; reason: "email_taken" | "invalid_referral" | "own_code" }

interface SessionContextValue {
  session: DemoSessionState
  signIn: (email: string, password: string) => Promise<LoginOutcome>
  signOut: () => void
  signUp: (input: {
    email: string
    password: string
    referralCode?: string
  }) => Promise<SignupOutcome>
  expireSession: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

function buildUserFromEmail(email: string): DemoUserProfile {
  const localPart = email.split("@")[0] || "sina"
  const displayName = localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")

  return {
    ...demoUserProfile,
    displayName,
    email,
  }
}

function writeSessionCookie(status: "authenticated" | "expired" | "anonymous") {
  if (status === "anonymous") {
    document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0`
    return
  }

  document.cookie = `${DEMO_SESSION_COOKIE}=${status}; path=/; max-age=2592000`
}

export function DemoSessionProvider({
  children,
  initialStatus = "anonymous",
}: {
  children: React.ReactNode
  initialStatus?: DemoSessionState["status"]
}) {
  const [session, setSession] = React.useState<DemoSessionState>({
    status: initialStatus,
    user: initialStatus === "authenticated" ? demoUserProfile : null,
  })

  const signIn = React.useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail.includes("locked")) {
      return { ok: false, reason: "locked" as const }
    }

    if (normalizedEmail.includes("unverified")) {
      return { ok: false, reason: "unverified" as const }
    }

    if (!normalizedEmail || password !== DEMO_PASSWORD) {
      return { ok: false, reason: "wrong_credentials" as const }
    }

    setSession({
      status: "authenticated",
      user: buildUserFromEmail(normalizedEmail),
    })
    window.localStorage.setItem("tunnel-demo-email", normalizedEmail)
    writeSessionCookie("authenticated")

    return { ok: true as const }
  }, [])

  const signUp = React.useCallback(
    async ({
      email,
      referralCode,
    }: {
      email: string
      password: string
      referralCode?: string
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 900))

      const normalizedEmail = email.trim().toLowerCase()
      const normalizedReferral = referralCode?.trim().toUpperCase()

      if (normalizedEmail.includes("taken")) {
        return { ok: false, reason: "email_taken" as const }
      }

      if (normalizedReferral === demoUserProfile.referralCode) {
        return { ok: false, reason: "own_code" as const }
      }

      if (normalizedReferral && !["SINA42", "TUN8KX", "VIP2026"].includes(normalizedReferral)) {
        return { ok: false, reason: "invalid_referral" as const }
      }

      return { ok: true as const }
    },
    []
  )

  const signOut = React.useCallback(() => {
    setSession({
      status: "anonymous",
      user: null,
    })
    writeSessionCookie("anonymous")
  }, [])

  const expireSession = React.useCallback(() => {
    setSession({
      status: "expired",
      user: null,
    })
    writeSessionCookie("expired")
  }, [])

  return (
    <SessionContext.Provider
      value={{
        expireSession,
        session,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useDemoSession() {
  const context = React.useContext(SessionContext)

  if (!context) {
    throw new Error("useDemoSession must be used within DemoSessionProvider")
  }

  return context
}
