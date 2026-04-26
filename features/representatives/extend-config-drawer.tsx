"use client"

import * as React from "react"
import { LoaderCircle, RefreshCcw } from "lucide-react"

import {
  addMonths,
  calculateRepCost,
  dataCapOptions,
  durationOptions,
  type RepConfig,
  type RepDataCap,
  type RepDuration,
} from "@/features/representatives/representatives-data"
import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatDate, formatToman } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function ExtendConfigDrawer({
  config,
  onClose,
  userId,
}: {
  config: RepConfig
  onClose: () => void
  userId: string
}) {
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { balance } = useWallet()
  const { extendConfig } = useRepresentatives()
  const [duration, setDuration] = React.useState<RepDuration>("1_month")
  const [addData, setAddData] = React.useState<RepDataCap>("50_gb")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const cost = Math.max(10_000, Math.round(calculateRepCost(duration, addData) / 2))
  const newExpiry = addMonths(
    new Date(config.expiresAt),
    durationOptions.find((item) => item.value === duration)?.months ?? 1
  )
  const addDataGb = dataCapOptions.find((item) => item.value === addData)?.gb ?? 50
  const newCap =
    config.totalGb === null || addDataGb === null ? null : config.totalGb + addDataGb
  const insufficientFunds = balance < cost

  function handleSubmit() {
    if (insufficientFunds) {
      setError(locale === "fa" ? "موجودی کیف پول کافی نیست." : "Insufficient wallet balance.")
      return
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const result = extendConfig({ addData, configId: config.id, duration, userId })

      if (!result.ok) {
        setError(locale === "fa" ? "موجودی کیف پول کافی نیست." : "Insufficient wallet balance.")
        return
      }

      addToast(locale === "fa" ? "کانفیگ تمدید شد." : "Config extended successfully.", "success")
      onClose()
    })
  }

  return (
    <Sheet open onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{locale === "fa" ? "تمدید کانفیگ" : "Extend config"}</SheetTitle>
          <SheetDescription>{config.server}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="rounded-xl border bg-muted/20 p-3 text-sm">
            <p>{locale === "fa" ? "انقضای فعلی" : "Current expiry"}: {formatDate(config.expiresAt, locale)}</p>
            <p>{locale === "fa" ? "مصرف فعلی" : "Current usage"}: {config.usedGb} / {config.totalGb ?? "Unlimited"} GB</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={duration} onChange={(event) => setDuration(event.target.value as RepDuration)}>
              {durationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={addData} onChange={(event) => setAddData(event.target.value as RepDataCap)}>
              {dataCapOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div className="space-y-2 rounded-xl border bg-muted/20 p-3 text-sm">
            <div className="flex justify-between gap-3"><span>{locale === "fa" ? "هزینه" : "Cost"}</span><strong>{formatToman(cost, locale)}</strong></div>
            <div className="flex justify-between gap-3"><span>{locale === "fa" ? "انقضای جدید" : "New expiry"}</span><strong>{formatDate(newExpiry.toISOString(), locale)}</strong></div>
            <div className="flex justify-between gap-3"><span>{locale === "fa" ? "حجم جدید" : "New data cap"}</span><strong>{newCap ?? "Unlimited"} GB</strong></div>
            <div className="flex justify-between gap-3"><span>{locale === "fa" ? "مانده بعد" : "Balance after"}</span><strong className={insufficientFunds ? "text-destructive" : ""}>{formatToman(Math.max(balance - cost, 0), locale)}</strong></div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={onClose}>{locale === "fa" ? "انصراف" : "Cancel"}</Button>
          <Button type="button" disabled={isPending || insufficientFunds} onClick={handleSubmit}>
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
            {locale === "fa" ? "تأیید و کسر از کیف پول" : "Confirm & deduct wallet"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
