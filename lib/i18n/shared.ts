import { getMessagesForLocale } from "@/lib/i18n/messages"
import { DEFAULT_APP_LOCALE, type AppLocale } from "@/lib/i18n/routing"

type TranslationValues = Record<string, number | string>

function getNestedValue(input: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment]
    }

    return undefined
  }, input)
}

function interpolate(
  template: string,
  values?: TranslationValues
): string {
  if (!values) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return String(values[key] ?? `{${key}}`)
  })
}

export function createTranslator(
  namespace?: string,
  locale: AppLocale = DEFAULT_APP_LOCALE
) {
  const messages = getMessagesForLocale(locale)
  const scopedMessages = namespace
    ? getNestedValue(messages, namespace)
    : messages

  return (key: string, values?: TranslationValues) => {
    const resolved =
      getNestedValue(scopedMessages, key) ??
      getNestedValue(messages, key) ??
      key

    return typeof resolved === "string"
      ? interpolate(resolved, values)
      : key
  }
}

