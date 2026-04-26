"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MailCheck } from "lucide-react"

import { AuthShell } from "@/features/auth/auth-shell"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"

export function VerifyEmailPage({ email }: { email?: string }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const [countdown, setCountdown] = React.useState(60)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <AuthShell eyebrow={locale === "fa" ? "تأیید ایمیل" : "Verify email"}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">
            {locale === "fa" ? "ایمیل خود را بررسی کنید" : "Check your inbox"}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {locale === "fa"
              ? `لینک تأیید برای ${email ?? "j***@gmail.com"} ارسال شد.`
              : `We sent a verification link to ${email ?? "j***@gmail.com"}.`}
          </p>
        </div>
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => {
              addToast(locale === "fa" ? "به داشبورد خوش آمدید." : "Welcome to Tunnel.", "success")
              router.push("/dashboard")
            }}
          >
            {locale === "fa" ? "ورود به داشبورد دمو" : "Continue to dashboard demo"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={countdown > 0}
            onClick={() => setCountdown(60)}
          >
            {countdown > 0
              ? locale === "fa"
                ? `ارسال مجدد تا ${countdown} ثانیه`
                : `Resend in ${countdown}s`
              : locale === "fa"
                ? "ارسال مجدد ایمیل"
                : "Resend email"}
          </Button>
        </div>
        <Link href={localizePathname("/login", locale)} className="text-sm text-primary underline-offset-4 hover:underline">
          {locale === "fa" ? "بازگشت به ورود" : "Back to sign in"}
        </Link>
      </div>
    </AuthShell>
  )
}
