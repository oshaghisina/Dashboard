import type { AppLocale } from "@/lib/types"

function getLocaleTag(locale: AppLocale) {
  return locale === "fa" ? "fa-IR-u-ca-persian" : "en-US"
}

export function formatNumber(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getLocaleTag(locale)).format(value)
}

export function formatCurrency(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getLocaleTag(locale), {
    style: "currency",
    currency: locale === "fa" ? "IRR" : "USD",
    maximumFractionDigits: locale === "fa" ? 0 : 2,
  }).format(locale === "fa" ? value * 820000 : value)
}

export function formatDate(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    dateStyle: "medium",
  }).format(new Date(value))
}

export function formatDateTime(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function formatGigabytes(value: number, locale: AppLocale) {
  const formatter = new Intl.NumberFormat(getLocaleTag(locale), {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })

  return formatter.format(value)
}
