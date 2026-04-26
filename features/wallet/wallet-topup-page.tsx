"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Banknote, Bitcoin, CreditCard, LoaderCircle, Plus } from "lucide-react"

import { topUpPresets } from "@/features/wallet/wallet-data"
import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatToman } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

type TopUpPaymentMethod = "card" | "crypto" | "bank"

export function WalletTopUpPage({ returnTo }: { returnTo?: string }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { addCredit } = useWallet()
  const [amount, setAmount] = React.useState<number>(100_000)
  const [customAmount, setCustomAmount] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState<TopUpPaymentMethod>("card")
  const [status, setStatus] = React.useState<"idle" | "processing" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const selectedAmount = customAmount ? Number(customAmount) : amount
  const amountError =
    Number.isNaN(selectedAmount) || selectedAmount < 10_000
      ? locale === "fa"
        ? "حداقل شارژ ۱۰٬۰۰۰ت است."
        : "Minimum top-up is 10,000T."
      : selectedAmount > 10_000_000
        ? locale === "fa"
          ? "حداکثر شارژ ۱۰٬۰۰۰٬۰۰۰ت است."
          : "Maximum single top-up is 10,000,000T."
        : ""

  async function handleSubmit() {
    if (amountError) {
      setErrorMessage(amountError)
      return
    }

    setStatus("processing")
    setErrorMessage("")
    await new Promise((resolve) => setTimeout(resolve, 900))
    addCredit({
      amount: selectedAmount,
      label:
        paymentMethod === "card"
          ? "Deposit · Card"
          : paymentMethod === "crypto"
            ? "Deposit · Crypto (USDT)"
            : "Deposit · Bank Transfer",
      type: "deposit",
    })
    addToast(
      locale === "fa"
        ? `${formatToman(selectedAmount, locale)} به کیف پول اضافه شد.`
        : `${formatToman(selectedAmount, locale)} added to your wallet.`,
      "success"
    )
    router.push(returnTo?.startsWith("/dashboard/billing") ? returnTo : "/dashboard/billing/wallet")
  }

  return (
    <DashboardPage
      title={locale === "fa" ? "شارژ کیف پول" : "Top up wallet"}
      description={
        locale === "fa"
          ? "مبلغ و روش پرداخت را انتخاب کنید."
          : "Choose an amount and payment method."
      }
    >
      <PageSection contentClassName="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionCard title={locale === "fa" ? "مبلغ" : "Amount"}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {topUpPresets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={!customAmount && amount === preset ? "default" : "outline"}
                  onClick={() => {
                    setAmount(preset)
                    setCustomAmount("")
                    setErrorMessage("")
                  }}
                >
                  {formatToman(preset, locale)}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {locale === "fa" ? "مبلغ دلخواه" : "Custom amount"}
              </label>
              <Input
                value={customAmount}
                onChange={(event) => {
                  setCustomAmount(event.target.value.replace(/\D/g, ""))
                  setErrorMessage("")
                }}
                inputMode="numeric"
                placeholder="100000"
                dir="ltr"
              />
            </div>
            {errorMessage || amountError ? (
              <p className="text-sm text-destructive">{errorMessage || amountError}</p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title={locale === "fa" ? "روش پرداخت" : "Pay with"}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { icon: CreditCard, key: "card" as const, label: locale === "fa" ? "کارت" : "Card" },
                { icon: Bitcoin, key: "crypto" as const, label: locale === "fa" ? "رمزارز" : "Crypto" },
                { icon: Banknote, key: "bank" as const, label: locale === "fa" ? "کارت به کارت" : "Bank" },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant={paymentMethod === item.key ? "default" : "outline"}
                    onClick={() => setPaymentMethod(item.key)}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>

            {paymentMethod === "card" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="4242 4242 4242 4242" dir="ltr" className="sm:col-span-2" />
                <Input placeholder="MM/YY" dir="ltr" />
                <Input placeholder="CVV" dir="ltr" />
              </div>
            ) : paymentMethod === "crypto" ? (
              <div className="overflow-x-auto rounded-xl border bg-muted/20 px-3.5 py-3 text-sm" dir="ltr">
                <code className="block min-w-max break-all">USDT TRC20: TXd3moWalletTopupAddress</code>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border bg-muted/20 px-3.5 py-3 text-sm" dir="ltr">
                <code className="block min-w-max break-all">IBAN: IR00 0000 0000 0000 0000 0000 00</code>
              </div>
            )}

            {status === "error" ? (
              <p className="text-sm text-destructive">
                {locale === "fa" ? "پرداخت ناموفق بود." : "Payment failed. Your wallet was not charged."}
              </p>
            ) : null}

            <Button
              type="button"
              className="w-full"
              disabled={status === "processing"}
              onClick={() => void handleSubmit()}
            >
              {status === "processing" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {locale === "fa"
                ? `افزودن ${formatToman(selectedAmount || 0, locale)}`
                : `Add ${formatToman(selectedAmount || 0, locale)} to wallet`}
            </Button>
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
