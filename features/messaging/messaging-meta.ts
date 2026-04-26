import type { MessagingSurface } from "@/features/messaging/messaging-types"

import { getMessagesForLocale } from "@/lib/i18n/messages"
import { DEFAULT_APP_LOCALE, type AppLocale } from "@/lib/i18n/routing"

export interface MessagingPageMeta {
  description: string
  title: string
}

export function getMessagingPageMeta(
  surface: MessagingSurface,
  appName: string,
  locale: AppLocale = DEFAULT_APP_LOCALE
): MessagingPageMeta {
  const messages = getMessagesForLocale(locale)
  const meta = messages.messaging.meta

  switch (surface) {
    case "dashboard":
      return {
        title: meta.dashboardTitle,
        description: meta.dashboardDescription,
      }
    case "doctor":
      return {
        title: meta.doctorTitle,
        description: meta.doctorDescription.replace("{appName}", appName),
      }
    case "patient":
      return {
        title: meta.patientTitle,
        description: meta.patientDescription.replace("{appName}", appName),
      }
  }
}
