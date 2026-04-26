import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DEMO_SESSION_COOKIE } from "@/lib/app-constants"
import { LoginPage } from "@/features/auth/login-page"

export default async function LoginRoute({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const cookieStore = await cookies()

  if (cookieStore.get(DEMO_SESSION_COOKIE)?.value === "authenticated") {
    redirect("/dashboard")
  }

  const params = await searchParams
  return <LoginPage reason={params.reason} />
}
