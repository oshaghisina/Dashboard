import { cookies } from "next/headers"

import { DEMO_LOCALE_COOKIE } from "@/lib/app-constants"
import { createTranslator } from "@/lib/i18n/shared"
import {
  DEFAULT_APP_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
} from "@/lib/i18n/routing"

export async function getRequestLocale() {
  const cookieStore = await cookies()
  const locale = cookieStore.get(DEMO_LOCALE_COOKIE)?.value

  return isSupportedLocale(locale) ? locale : DEFAULT_APP_LOCALE
}

export async function getRequestDirection() {
  return getLocaleDirection(await getRequestLocale())
}

export async function getServerTranslator(namespace?: string) {
  return createTranslator(namespace, await getRequestLocale())
}
