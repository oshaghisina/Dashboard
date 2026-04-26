"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Eye, EyeOff, LoaderCircle } from "lucide-react"

import { AuthShell } from "@/features/auth/auth-shell"
import { useDemoSession } from "@/components/providers/session-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const copy = {
  en: {
    addReferral: "Have a referral code? Add it",
    applied: "Applied",
    cta: "Create account",
    email: "Email",
    invalidReferral: "This referral code isn't valid.",
    ownReferral: "You can't use your own referral code.",
    password: "Password",
    confirmPassword: "Confirm password",
    referralLabel: "Referral code",
    signupTaken: "An account with this email already exists.",
    signin: "Already have an account?",
    title: "Create your account",
    invitedBy: "You were invited by Sina",
    reward: "You'll get 20% off your first plan",
  },
  fa: {
    addReferral: "کد دعوت دارید؟ اضافه کنید",
    applied: "اعمال شد",
    cta: "ایجاد حساب",
    email: "ایمیل",
    invalidReferral: "این کد دعوت معتبر نیست.",
    ownReferral: "نمی‌توانید از کد دعوت خودتان استفاده کنید.",
    password: "رمز عبور",
    confirmPassword: "تکرار رمز عبور",
    referralLabel: "کد دعوت",
    signupTaken: "حسابی با این ایمیل وجود دارد.",
    signin: "قبلاً ثبت‌نام کرده‌اید؟",
    title: "حساب خود را بسازید",
    invitedBy: "شما توسط سینا دعوت شده‌اید",
    reward: "برای اولین پلن ۲۰٪ تخفیف می‌گیرید",
  },
} as const

export function SignupPage({ initialReferralCode }: { initialReferralCode?: string }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { signUp } = useDemoSession()
  const text = copy[locale]
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [showReferral, setShowReferral] = React.useState(Boolean(initialReferralCode))
  const [referralCode, setReferralCode] = React.useState(initialReferralCode ?? "")
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const isLockedReferral = Boolean(initialReferralCode)
  const isValidReferral = ["SINA42", "TUN8KX", "VIP2026"].includes(referralCode.toUpperCase())

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (password.length < 8 || password !== confirmPassword) {
        setError(locale === "fa" ? "رمز عبور باید حداقل ۸ کاراکتر باشد و با تکرار آن یکسان بماند." : "Password must be at least 8 characters and match the confirmation field.")
        return
      }

      startTransition(async () => {
        const result = await signUp({
          email,
          password,
          referralCode: showReferral ? referralCode : undefined,
        })

        if (!result.ok) {
          setError(
            result.reason === "email_taken"
              ? text.signupTaken
              : result.reason === "own_code"
                ? text.ownReferral
                : text.invalidReferral
          )
          return
        }

        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      })
    },
    [confirmPassword, email, locale, password, referralCode, router, showReferral, signUp, text.invalidReferral, text.ownReferral, text.signupTaken]
  )

  return (
    <AuthShell eyebrow={locale === "fa" ? "ثبت‌نام" : "Sign up"}>
      <div className="space-y-6">
        <div className="space-y-2">
          {showReferral && isValidReferral ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="font-medium">{text.invitedBy}</p>
              <p className="text-sm text-muted-foreground">{text.reward}</p>
            </div>
          ) : null}
          <h2 className="text-3xl font-bold">{text.title}</h2>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{locale === "fa" ? "خطا" : "Error"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">{text.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              dir="ltr"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{text.password}</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  dir="ltr"
                  className="pr-12"
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
            <div className="space-y-2">
              <label className="text-sm font-medium">{text.confirmPassword}</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  dir="ltr"
                  className="pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {!showReferral ? (
            <button
              type="button"
              className="text-sm text-primary underline-offset-4 hover:underline"
              onClick={() => setShowReferral(true)}
            >
              {text.addReferral}
            </button>
          ) : (
            <div className="space-y-2 rounded-2xl border p-4">
              <label className="text-sm font-medium">{text.referralLabel}</label>
              <div className="relative">
                <Input
                  value={referralCode}
                  onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                  readOnly={isLockedReferral}
                  dir="ltr"
                />
                {referralCode && isValidReferral ? (
                  <span className="absolute inset-y-0 right-3 flex items-center gap-1 text-sm text-primary">
                    <Check className="size-4" />
                    {text.applied}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoaderCircle className="animate-spin" /> : null}
            {text.cta}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          {text.signin}{" "}
          <Link href={localizePathname("/login", locale)} className="text-primary underline-offset-4 hover:underline">
            {locale === "fa" ? "وارد شوید" : "Sign in"}
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
