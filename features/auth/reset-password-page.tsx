"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthShell } from "@/features/auth/auth-shell"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { localizePathname } from "@/lib/i18n/routing"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ResetPasswordPage({ state = "default" }: { state?: "default" | "expired" | "used" | "success" }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [viewState, setViewState] = React.useState(state)

  if (viewState === "expired" || viewState === "used") {
    return (
      <AuthShell eyebrow={locale === "fa" ? "رمز جدید" : "New password"}>
        <Alert variant="destructive">
          <AlertTitle>{locale === "fa" ? "لینک معتبر نیست" : "Link is no longer valid"}</AlertTitle>
          <AlertDescription>
            {locale === "fa"
              ? "لطفاً یک لینک جدید برای بازیابی رمز عبور درخواست کنید."
              : "Please request a new password reset link."}
          </AlertDescription>
        </Alert>
      </AuthShell>
    )
  }

  if (viewState === "success") {
    return (
      <AuthShell eyebrow={locale === "fa" ? "رمز جدید" : "New password"}>
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">
            {locale === "fa" ? "رمز عبور به‌روزرسانی شد" : "Password updated"}
          </h2>
          <Button asChild className="w-full">
            <Link href={localizePathname("/login", locale)}>
              {locale === "fa" ? "بازگشت به ورود" : "Back to sign in"}
            </Link>
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell eyebrow={locale === "fa" ? "رمز جدید" : "New password"}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (password.length < 8 || password !== confirmPassword) {
            return
          }
          setViewState("success")
          router.refresh()
        }}
      >
        <h2 className="text-3xl font-bold">
          {locale === "fa" ? "رمز جدید انتخاب کنید" : "Choose a new password"}
        </h2>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          dir="ltr"
          placeholder={locale === "fa" ? "رمز جدید" : "New password"}
        />
        <Input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          dir="ltr"
          placeholder={locale === "fa" ? "تکرار رمز" : "Confirm new password"}
        />
        <Button className="w-full">
          {locale === "fa" ? "ذخیره رمز جدید" : "Save new password"}
        </Button>
      </form>
    </AuthShell>
  )
}
