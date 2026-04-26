import type { AppDirection, AppLocale } from "@/lib/types"

export type { AppDirection, AppLocale } from "@/lib/types"

export const appLocales: AppLocale[] = ["en", "fa"]
export const DEFAULT_APP_LOCALE: AppLocale = "fa"

export function isSupportedLocale(
  value: string | null | undefined
): value is AppLocale {
  return value === "en" || value === "fa"
}

export function getLocaleDirection(locale: AppLocale): AppDirection {
  return locale === "fa" ? "rtl" : "ltr"
}

export function getOpenGraphLocale(locale: AppLocale) {
  return locale === "fa" ? "fa_IR" : "en_US"
}

export function stripLocalePrefix(pathname: string) {
  return {
    locale: null,
    pathname,
  }
}

export function localizePathname(pathname: string, _locale: AppLocale) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}
