"use client"

import { TicketsProvider } from "@/features/tickets/tickets-provider"
import { RepresentativesProvider } from "@/features/representatives/representatives-provider"
import { WalletProvider } from "@/features/wallet/wallet-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function DashboardRouteProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <WalletProvider>
        <RepresentativesProvider>
          <TicketsProvider>{children}</TicketsProvider>
        </RepresentativesProvider>
      </WalletProvider>
    </TooltipProvider>
  )
}
