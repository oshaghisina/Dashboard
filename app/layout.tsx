import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"

import { DEMO_LOCALE_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/app-constants"
import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import {
  DEFAULT_APP_LOCALE,
  getLocaleDirection,
  getOpenGraphLocale,
  isSupportedLocale,
} from "@/lib/i18n/routing"
import { fontVariables } from "@/lib/shared-runtime/fonts"
import { cn } from "@/lib/utils"
import { AppProviders } from "@/components/providers/app-providers"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: getOpenGraphLocale(DEFAULT_APP_LOCALE),
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(DEMO_LOCALE_COOKIE)?.value
  const sessionCookie = cookieStore.get(DEMO_SESSION_COOKIE)?.value
  const locale = isSupportedLocale(localeCookie) ? localeCookie : DEFAULT_APP_LOCALE
  const direction = getLocaleDirection(locale)
  const sessionStatus =
    sessionCookie === "authenticated" || sessionCookie === "expired"
      ? sessionCookie
      : "anonymous"

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn(fontVariables, "style-nova")}
    >
      <head>
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body className="group/body overscroll-none antialiased">
        <AppProviders initialLocale={locale} initialSessionStatus={sessionStatus}>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
