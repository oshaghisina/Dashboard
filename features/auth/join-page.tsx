"use client"

import Link from "next/link"

import { AuthShell } from "@/features/auth/auth-shell"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { referralLanding } from "@/lib/mock-data/vpn"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"

export function JoinPage({ code }: { code: string }) {
  const { locale } = useLocaleContext()

  return (
    <AuthShell eyebrow={locale === "fa" ? "دعوت" : "Invitation"}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {referralLanding.avatarLabel}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">
            {locale === "fa"
              ? `${referralLanding.firstName} شما را به تونل دعوت کرده است`
              : `${referralLanding.firstName} invites you to Tunnel`}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {locale === "fa"
              ? "VPN سریع و امن با تخفیف اولین خرید."
              : "Fast, secure VPN access with a discount on your first purchase."}
          </p>
        </div>
        <div className="rounded-2xl border bg-primary/5 p-4 text-sm">
          <p>{referralLanding.reward}</p>
          <p dir="ltr" className="mt-2 font-mono text-base font-semibold">
            {code.toUpperCase()}
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href={localizePathname(`/signup?ref=${code.toUpperCase()}`, locale)}>
            {locale === "fa" ? "ایجاد حساب" : "Create account"}
          </Link>
        </Button>
      </div>
    </AuthShell>
  )
}
