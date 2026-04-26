"use client"

import { TicketsProvider } from "@/features/tickets/tickets-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function DashboardRouteProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <TicketsProvider>{children}</TicketsProvider>
    </TooltipProvider>
  )
}
