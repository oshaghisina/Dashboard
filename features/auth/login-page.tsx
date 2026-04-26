"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"

import { AuthShell } from "@/features/auth/auth-shell"
import { useDemoSession } from "@/components/providers/session-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { DEMO_PASSWORD } from "@/lib/app-constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const copy = {
  en: {
    cta: "Sign in",
    demoHint: `Use any email with password ${DEMO_PASSWORD}. Emails containing "locked" or "unverified" trigger demo states.`,
    email: "Email",
    forgot: "Forgot password?",
    password: "Password",
    reasonExpired: "Your session expired. Sign in again to continue.",
    signup: "Create account",
    title: "Welcome back",
    wrong: "Email or password is incorrect.",
    locked: "Too many attempts. Try again later or reset your password.",
    unverified: "Please verify your email first.",
  },
  fa: {
    cta: "ورود",
    demoHint: `برای ورود از هر ایمیل با رمز ${DEMO_PASSWORD} استفاده کنید. ایمیل‌های دارای locked یا unverified حالت‌های دمو را فعال می‌کنند.`,
    email: "ایمیل",
    forgot: "فراموشی رمز عبور",
    password: "رمز عبور",
    reasonExpired: "نشست شما منقضی شده است. دوباره وارد شوید.",
    signup: "ایجاد حساب",
    title: "خوش برگشتید",
    wrong: "ایمیل یا رمز عبور نادرست است.",
    locked: "تلاش‌های زیاد ثبت شده است. بعداً دوباره تلاش کنید.",
    unverified: "ابتدا ایمیل خود را تأیید کنید.",
  },
} as const

export function LoginPage({ reason }: { reason?: string }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { signIn } = useDemoSession()
  const { addToast } = useUiState()
  const text = copy[locale]
  const [email, setEmail] = React.useState("sina@example.com")
  const [password, setPassword] = React.useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(
    reason === "expired" ? text.reasonExpired : null
  )
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setError(null)

      startTransition(async () => {
        const result = await signIn(email, password)

        if (!result.ok) {
          setError(
            result.reason === "locked"
              ? text.locked
              : result.reason === "unverified"
                ? text.unverified
                : text.wrong
          )
          return
        }

        addToast(locale === "fa" ? "ورود با موفقیت انجام شد." : "Signed in successfully.", "success")
        router.push("/dashboard")
      })
    },
    [addToast, email, locale, password, router, signIn, text.locked, text.unverified, text.wrong]
  )

  return (
    <AuthShell eyebrow={locale === "fa" ? "ورود" : "Sign in"}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{text.title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {text.demoHint}
          </p>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{locale === "fa" ? "خطا" : "Error"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">{text.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              dir="ltr"
              suppressHydrationWarning
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{text.password}</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                dir="ltr"
                className="pr-12"
                suppressHydrationWarning
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoaderCircle className="animate-spin" /> : null}
            {text.cta}
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href={localizePathname("/forgot-password", locale)} className="text-primary underline-offset-4 hover:underline">
            {text.forgot}
          </Link>
          <Link href={localizePathname("/signup", locale)} className="text-primary underline-offset-4 hover:underline">
            {text.signup}
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}
