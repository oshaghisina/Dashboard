"use client"

import * as React from "react"

import { AuthShell } from "@/features/auth/auth-shell"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ForgotPasswordPage() {
  const { locale } = useLocaleContext()
  const [email, setEmail] = React.useState("sina@example.com")
  const [submitted, setSubmitted] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  return (
    <AuthShell eyebrow={locale === "fa" ? "بازیابی رمز" : "Reset password"}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">
            {locale === "fa" ? "رمز عبور را بازنشانی کنید" : "Reset your password"}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {locale === "fa"
              ? "اگر این ایمیل در سیستم ثبت شده باشد، لینک بازیابی ارسال می‌شود."
              : "If that email is registered, you'll receive a link shortly."}
          </p>
        </div>

        {submitted ? (
          <Alert>
            <AlertTitle>{locale === "fa" ? "ارسال شد" : "Sent"}</AlertTitle>
            <AlertDescription>
              {locale === "fa"
                ? "در صورت ثبت بودن ایمیل، لینک بازیابی برای شما ارسال می‌شود."
                : "If that email is registered, you'll receive a reset link shortly."}
            </AlertDescription>
          </Alert>
        ) : null}

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            startTransition(async () => {
              await new Promise((resolve) => setTimeout(resolve, 800))
              setSubmitted(true)
            })
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {locale === "fa" ? "ایمیل" : "Email"}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              dir="ltr"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {locale === "fa" ? "ارسال لینک" : "Send reset link"}
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}
