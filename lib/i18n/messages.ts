import enMessages from "@/lib/i18n/messages/en"
import faMessages from "@/lib/i18n/messages/fa"
import type { AppLocale } from "@/lib/i18n/routing"

export type AppMessages = typeof enMessages
export type AppMessageNamespace = keyof AppMessages

export function getMessagesForLocale(locale: AppLocale): AppMessages {
  return locale === "fa" ? faMessages : enMessages
}

export function getMessagesSubsetForLocale<
  Namespaces extends readonly AppMessageNamespace[],
>(_locale: AppLocale, namespaces: Namespaces) {
  return Object.fromEntries(
    namespaces.map((namespace) => [namespace, enMessages[namespace]])
  ) as Pick<AppMessages, Namespaces[number]>
}
