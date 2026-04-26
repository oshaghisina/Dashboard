"use client"

import { MessagingExperience } from "@/features/messaging/messaging-experience"
import { getMessagingPageMeta } from "@/features/messaging/messaging-meta"
import type { MessagingPageState } from "@/features/messaging/messaging-state"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"
import { DashboardPage } from "@/components/dashboard/dashboard-page"

export interface DashboardMessagingPageProps {
  pageState: MessagingPageState
}

export function DashboardMessagingPage({
  pageState,
}: DashboardMessagingPageProps) {
  const locale = useLocale()
  const t = useTranslations()
  const pageMeta = getMessagingPageMeta("dashboard", pageState.appName, locale)

  return (
    <DashboardPage
      title={pageMeta.title}
      description={pageMeta.description}
      actions={
        <>
          <Badge variant="outline">
            {pageState.backend === "mock"
              ? t("messaging.transport.mock")
              : t("messaging.transport.matrix")}
          </Badge>
          <Badge variant="secondary">
            {t(`messaging.roles.${pageState.viewer.role}`)}
          </Badge>
        </>
      }
    >
      <MessagingExperience pageState={pageState} surface="dashboard" />
    </DashboardPage>
  )
}
