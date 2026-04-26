import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DEMO_SESSION_COOKIE } from "@/lib/app-constants"
import { SignupPage } from "@/features/auth/signup-page"

export default async function SignupRoute({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const cookieStore = await cookies()

  if (cookieStore.get(DEMO_SESSION_COOKIE)?.value === "authenticated") {
    redirect("/dashboard")
  }

  const params = await searchParams
  return <SignupPage initialReferralCode={params.ref?.toUpperCase()} />
}
