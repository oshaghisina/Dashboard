import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DEMO_SESSION_COOKIE } from "@/lib/app-constants"
import { AppHeader } from "@/components/dashboard/app-header"
import { AppShell } from "@/components/dashboard/app-shell"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const status = cookieStore.get(DEMO_SESSION_COOKIE)?.value

  if (status !== "authenticated") {
    redirect(status === "expired" ? "/login?reason=expired" : "/login")
  }

  return (
    <AppShell sidebar={<AppSidebar />} header={<AppHeader />}>
      {children}
    </AppShell>
  )
}
