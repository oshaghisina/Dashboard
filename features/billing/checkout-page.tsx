"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { WalletPaymentTab } from "@/features/wallet/wallet-payment-tab"
import { useWallet } from "@/features/wallet/wallet-provider"
import { planOptions } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatCurrency } from "@/lib/formatting"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SectionCard } from "@/components/dashboard/section-card"

export function CheckoutPage({
  initialCycle,
  initialPlanId,
}: {
  initialCycle: "monthly" | "quarterly" | "yearly"
  initialPlanId: string
}) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { addDebit, balance } = useWallet()
  const plan = planOptions.find((item) => item.id === initialPlanId) ?? planOptions[1]
  const [cycle, setCycle] = React.useState(initialCycle)
  const [promoCode, setPromoCode] = React.useState("")
  const [appliedPromoCode, setAppliedPromoCode] = React.useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = React.useState<"wallet" | "bank" | "card" | "crypto">(
    balance > 0 ? "wallet" : "card"
  )
  const [status, setStatus] = React.useState<"error" | "idle" | "processing">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")
  const basePrice =
    cycle === "monthly"
      ? plan.monthlyPrice
      : cycle === "quarterly"
        ? plan.quarterlyPrice
        : plan.yearlyPrice
  const discount = appliedPromoCode ? 1 : 0
  const total = Math.max(basePrice - discount, 0)
  const walletTotal = Math.round(total * 12_000)

  function handleSuccessfulPayment(message: string) {
    addToast(message, "success")
    router.push(`/dashboard/billing/success?plan=${plan.id}&cycle=${cycle}`)
  }

  return (
    <DashboardPage
      title={locale === "fa" ? "تکمیل خرید" : "Complete your purchase"}
      description={
        locale === "fa"
          ? "پلن، دوره پرداخت و روش پرداخت را بررسی کنید."
          : "Review your plan, billing cycle, and payment method."
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <SectionCard title={locale === "fa" ? "خلاصه سفارش" : "Order summary"}>
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{plan.name}</span>
              <span>{cycle}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{locale === "fa" ? "مبلغ پایه" : "Subtotal"}</span>
              <span>{formatCurrency(basePrice, locale)}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{locale === "fa" ? "تخفیف" : "Discount"}</span>
              <span>-{formatCurrency(discount, locale)}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 font-medium">
              <span>{locale === "fa" ? "مجموع" : "Total"}</span>
              <span>{formatCurrency(total, locale)}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={locale === "fa" ? "پرداخت" : "Checkout"}>
          <div className="space-y-3.5">
            <div className="flex flex-wrap gap-2">
              {(["monthly", "quarterly", "yearly"] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={cycle === item ? "default" : "outline"}
                  onClick={() => setCycle(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {locale === "fa" ? "کد تخفیف" : "Promo code"}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                  dir="ltr"
                  className="min-w-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="sm:shrink-0"
                  onClick={() => {
                    if (promoCode === "WELCOME10") {
                      setAppliedPromoCode(promoCode)
                      addToast(locale === "fa" ? "کد تخفیف اعمال شد." : "Promo code applied.", "success")
                    } else {
                      setAppliedPromoCode(null)
                      setErrorMessage(locale === "fa" ? "کد تخفیف معتبر نیست." : "Invalid promo code.")
                    }
                  }}
                >
                  {locale === "fa" ? "اعمال" : "Apply"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["wallet", "card", "crypto", "bank"] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={paymentMethod === item ? "default" : "outline"}
                  disabled={item === "wallet" && balance === 0}
                  onClick={() => setPaymentMethod(item)}
                >
                  {item === "wallet" && balance === 0 ? (
                    <Badge variant="outline">{locale === "fa" ? "خالی" : "Empty"}</Badge>
                  ) : null}
                  {item}
                </Button>
              ))}
            </div>

            {paymentMethod === "wallet" ? (
              <WalletPaymentTab
                orderTotal={walletTotal}
                processing={status === "processing"}
                onPay={async () => {
                  setStatus("processing")
                  setErrorMessage("")
                  await new Promise((resolve) => setTimeout(resolve, 900))

                  const transaction = addDebit({
                    amount: walletTotal,
                    label: `Plan Purchase · ${plan.name} ${cycle}`,
                    type: "plan_purchase",
                  })

                  if (!transaction) {
                    setStatus("error")
                    setErrorMessage(
                      locale === "fa"
                        ? "موجودی کیف پول کافی نیست."
                        : "Insufficient wallet balance."
                    )
                    return
                  }

                  handleSuccessfulPayment(
                    locale === "fa"
                      ? "پرداخت از کیف پول با موفقیت انجام شد."
                      : "Wallet payment successful."
                  )
                }}
              />
            ) : paymentMethod === "card" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="4242 4242 4242 4242" dir="ltr" className="sm:col-span-2" />
                <Input placeholder="MM/YY" dir="ltr" />
                <Input placeholder="CVV" dir="ltr" />
                <Input placeholder={locale === "fa" ? "نام روی کارت" : "Name on card"} />
              </div>
            ) : paymentMethod === "crypto" ? (
              <div className="overflow-x-auto rounded-xl border bg-muted/20 px-3.5 py-3 text-sm" dir="ltr">
                <code className="block min-w-max break-all">0.00023 BTC to 1A2b3C... [QR placeholder]</code>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border bg-muted/20 px-3.5 py-3 text-sm" dir="ltr">
                <code className="block min-w-max break-all">IBAN: IR00 0000 0000 0000 0000 0000 00</code>
              </div>
            )}

            {status === "error" && errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            {paymentMethod !== "wallet" ? (
              <Button
                className="w-full"
                disabled={status === "processing"}
                onClick={async () => {
                  setStatus("processing")
                  setErrorMessage("")
                  await new Promise((resolve) => setTimeout(resolve, 1000))

                  if (promoCode && promoCode !== "WELCOME10") {
                    setStatus("error")
                    setErrorMessage(locale === "fa" ? "پرداخت انجام نشد." : "Payment could not be processed.")
                    return
                  }

                  handleSuccessfulPayment(locale === "fa" ? "پرداخت با موفقیت انجام شد." : "Payment successful.")
                }}
              >
                {status === "processing"
                  ? locale === "fa"
                    ? "در حال پردازش..."
                    : "Processing..."
                  : locale === "fa"
                    ? `پرداخت ${formatCurrency(total, locale)}`
                    : `Pay ${formatCurrency(total, locale)}`}
              </Button>
            ) : null}
          </div>
        </SectionCard>
      </div>
    </DashboardPage>
  )
}
