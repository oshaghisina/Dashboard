"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { DEMO_LOCALE_COOKIE } from "@/lib/app-constants"
import {
  DEFAULT_APP_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
} from "@/lib/i18n/routing"
import type { AppDirection, AppLocale } from "@/lib/types"

interface LocaleContextValue {
  direction: AppDirection
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_APP_LOCALE,
}: {
  children: React.ReactNode
  initialLocale?: AppLocale
}) {
  const router = useRouter()
  const [locale, setLocaleState] = React.useState<AppLocale>(initialLocale)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(DEMO_LOCALE_COOKIE)

    if (isSupportedLocale(stored) && stored !== locale) {
      setLocaleState(stored)
      document.cookie = `${DEMO_LOCALE_COOKIE}=${stored}; path=/; max-age=31536000`
    }
  }, [locale])

  React.useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = getLocaleDirection(locale)
  }, [locale])

  const setLocale = React.useCallback(
    (nextLocale: AppLocale) => {
      setLocaleState(nextLocale)
      window.localStorage.setItem(DEMO_LOCALE_COOKIE, nextLocale)
      document.cookie = `${DEMO_LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000`
      router.refresh()
    },
    [router]
  )

  return (
    <LocaleContext.Provider
      value={{
        direction: getLocaleDirection(locale),
        locale,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocaleContext() {
  const context = React.useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider")
  }

  return context
}
