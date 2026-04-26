"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, ShieldPlus } from "lucide-react"

import {
  calculateRepCost,
  dataCapOptions,
  durationOptions,
  representativeServers,
  type RepDataCap,
  type RepDuration,
} from "@/features/representatives/representatives-data"
import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useWallet } from "@/features/wallet/wallet-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatToman } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function AssignConfigDrawer({
  open = true,
  userId,
}: {
  open?: boolean
  userId?: string
}) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { balance } = useWallet()
  const { assignConfig, users } = useRepresentatives()
  const [selectedUserId, setSelectedUserId] = React.useState(userId ?? users[0]?.id ?? "")
  const [server, setServer] = React.useState<string>(representativeServers[0])
  const [duration, setDuration] = React.useState<RepDuration>("1_month")
  const [dataCap, setDataCap] = React.useState<RepDataCap>("100_gb")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const cost = calculateRepCost(duration, dataCap)
  const insufficientFunds = balance < cost

  function close() {
    router.push(userId ? `/dashboard/representatives/users/${userId}` : "/dashboard/representatives")
  }

  function handleSubmit() {
    if (!selectedUserId) {
      setError(locale === "fa" ? "کاربر را انتخاب کنید." : "Select a user.")
      return
    }

    if (insufficientFunds) {
      setError(locale === "fa" ? "موجودی کیف پول کافی نیست." : "Insufficient wallet balance.")
      return
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const result = assignConfig({ dataCap, duration, server, userId: selectedUserId })

      if (!result.ok) {
        setError(locale === "fa" ? "موجودی کیف پول کافی نیست." : "Insufficient wallet balance.")
        return
      }

      addToast(locale === "fa" ? "کانفیگ تخصیص داده شد." : "Config assigned successfully.", "success")
      router.push(`/dashboard/representatives/users/${selectedUserId}`)
    })
  }

  return (
    <Sheet open={open} onOpenChange={(next) => (!next ? close() : undefined)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{locale === "fa" ? "تخصیص کانفیگ" : "Assign config"}</SheetTitle>
          <SheetDescription>
            {locale === "fa"
              ? "کانفیگ جدید را از کیف پول نماینده شارژ کنید."
              : "Create a config and deduct the cost from the representative wallet."}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === "fa" ? "کاربر" : "User"}</label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === "fa" ? "سرور" : "Server"}</label>
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={server} onChange={(event) => setServer(event.target.value)}>
              {representativeServers.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={duration} onChange={(event) => setDuration(event.target.value as RepDuration)}>
              {durationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={dataCap} onChange={(event) => setDataCap(event.target.value as RepDataCap)}>
              {dataCapOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div className="space-y-2 rounded-xl border bg-muted/20 p-3 text-sm">
            <div className="flex justify-between gap-3">
              <span>{locale === "fa" ? "هزینه" : "Cost"}</span>
              <strong>{formatToman(cost, locale)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span>{locale === "fa" ? "موجودی کیف پول" : "Wallet balance"}</span>
              <strong>{formatToman(balance, locale)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span>{locale === "fa" ? "مانده بعد" : "Balance after"}</span>
              <strong className={insufficientFunds ? "text-destructive" : ""}>{formatToman(Math.max(balance - cost, 0), locale)}</strong>
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={close}>{locale === "fa" ? "انصراف" : "Cancel"}</Button>
          <Button type="button" disabled={isPending || insufficientFunds} onClick={handleSubmit}>
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <ShieldPlus className="size-4" />}
            {locale === "fa" ? "تأیید و کسر از کیف پول" : "Confirm & deduct wallet"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
