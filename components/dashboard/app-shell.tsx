import * as React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { NotificationDrawer } from "@/components/dashboard/notification-drawer"

export interface AppShellProps {
  sidebar: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3.25rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      {sidebar}
      <SidebarInset className="min-h-svh bg-muted/20">
        <div className="flex min-h-svh flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {header}
          <div className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</div>
        </div>
      </SidebarInset>
      <NotificationDrawer />
      <MobileNav />
    </SidebarProvider>
  )
}
