"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useDemoSession } from "@/components/providers/session-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  isVpnPathActive,
  vpnNavigationItems,
} from "@/components/dashboard/navigation"

export function AppSidebar() {
  const pathname = usePathname()
  const { direction, locale } = useLocaleContext()
  const { session } = useDemoSession()
  const navigationItems = vpnNavigationItems.filter(
    (item) =>
      item.key !== "representatives" ||
      session.user?.role === "representative"
  )

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      side={direction === "rtl" ? "right" : "left"}
      className="hidden md:flex"
    >
      <SidebarHeader className="gap-4 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="gap-3">
              <Link href={localizePathname("/dashboard", locale)}>
                <Image src="/logo.png" alt="Sharknet" width={36} height={36} className="dark:invert" />
                <span className="grid flex-1 text-sm leading-tight">
                  <span className="font-semibold">
                    {locale === "fa" ? "شارک نت" : "Sharkent"}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {locale === "fa" ? "داشبورد مشترک" : "Subscriber dashboard"}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {locale === "fa" ? "منو" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isVpnPathActive(item.href, pathname)}
                      tooltip={item.title[locale]}
                    >
                      <Link href={localizePathname(item.href, locale)}>
                        <Icon className="size-4" />
                        <span>{item.title[locale]}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-accent/30 px-3 py-3 group-data-[collapsible=icon]:hidden">
          <div>
            <p className="text-sm font-medium">
              {locale === "fa" ? "فرانت‌اند دمو" : "Frontend demo"}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {locale === "fa"
                ? "بدون بک‌اند و با داده‌های ساختگی"
                : "Mocked flows with no backend"}
            </p>
          </div>
          <Badge variant="secondary">{locale === "fa" ? "دمو" : "Demo"}</Badge>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
