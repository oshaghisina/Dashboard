"use client"

import Link from "next/link"
import { ArrowUpRight, Wallet } from "lucide-react"

import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatToman } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"

export function WalletPaymentTab({
  disabled,
  orderTotal,
  onPay,
  processing,
}: {
  disabled?: boolean
  orderTotal: number
  onPay: () => void
  processing?: boolean
}) {
  const { locale } = useLocaleContext()
  const { balance } = useWallet()
  const remaining = balance - orderTotal
  const sufficientFunds = remaining >= 0

  return (
    <div className="rounded-xl border bg-muted/20 p-3.5">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span>{locale === "fa" ? "موجودی کیف پول" : "Wallet balance"}</span>
          <span className="font-medium">{formatToman(balance, locale)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{locale === "fa" ? "مبلغ سفارش" : "Order total"}</span>
          <span className="font-medium">-{formatToman(orderTotal, locale)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <span>{locale === "fa" ? "مانده پس از پرداخت" : "Remaining after payment"}</span>
          <span className={sufficientFunds ? "font-medium" : "font-medium text-destructive"}>
            {formatToman(Math.max(remaining, 0), locale)}
          </span>
        </div>
      </div>

      {sufficientFunds ? (
        <Button
          type="button"
          className="mt-4 w-full"
          disabled={disabled || processing}
          onClick={onPay}
        >
          <Wallet className="size-4" />
          {processing
            ? locale === "fa"
              ? "در حال پردازش..."
              : "Processing..."
            : locale === "fa"
              ? `پرداخت ${formatToman(orderTotal, locale)} از کیف پول`
              : `Pay ${formatToman(orderTotal, locale)} from wallet`}
        </Button>
      ) : (
        <Button asChild type="button" variant="outline" className="mt-4 w-full">
          <Link href={localizePathname("/dashboard/billing/wallet/topup?returnTo=/dashboard/billing/checkout", locale)}>
            <span>
              {locale === "fa"
                ? `شارژ ${formatToman(Math.abs(remaining), locale)}`
                : `Top up ${formatToman(Math.abs(remaining), locale)}`}
            </span>
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
