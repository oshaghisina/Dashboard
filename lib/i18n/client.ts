"use client"

import * as React from "react"

import { createTranslator } from "@/lib/i18n/shared"
import { useLocaleContext } from "@/components/providers/locale-provider"

export function useLocale() {
  return useLocaleContext().locale
}

export function useTranslations(namespace?: string) {
  const { locale } = useLocaleContext()

  return React.useMemo(() => createTranslator(namespace, locale), [locale, namespace])
}
