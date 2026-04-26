"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, UserPlus } from "lucide-react"

import { useRepresentatives } from "@/features/representatives/representatives-provider"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

function isValidContact(value: string) {
  return /^\S+@\S+\.\S+$/.test(value) || /^09\d{9}$/.test(value)
}

export function CreateUserDrawer({ open = true }: { open?: boolean }) {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { createUser } = useRepresentatives()
  const [name, setName] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  function close() {
    router.push("/dashboard/representatives/users")
  }

  function handleSubmit() {
    if (name.trim().length < 2) {
      setError(locale === "fa" ? "نام باید حداقل دو حرف باشد." : "Name must be at least 2 characters.")
      return
    }

    if (!isValidContact(contact.trim())) {
      setError(locale === "fa" ? "ایمیل یا شماره موبایل معتبر وارد کنید." : "Enter a valid email or phone number.")
      return
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const user = createUser({ contact, name, notes })
      addToast(locale === "fa" ? "کاربر ایجاد شد." : "User created successfully.", "success")
      router.push(`/dashboard/representatives/users/${user.id}`)
    })
  }

  return (
    <Sheet open={open} onOpenChange={(next) => (!next ? close() : undefined)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{locale === "fa" ? "افزودن کاربر" : "Add new user"}</SheetTitle>
          <SheetDescription>
            {locale === "fa"
              ? "کاربر جدید را به فهرست نماینده اضافه کنید."
              : "Add a new end-user to your representative list."}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === "fa" ? "نام کامل" : "Full name"}</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === "fa" ? "موبایل یا ایمیل" : "Phone or email"}</label>
            <Input value={contact} onChange={(event) => setContact(event.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === "fa" ? "یادداشت" : "Notes"}</label>
            <Textarea maxLength={200} value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={close}>
            {locale === "fa" ? "انصراف" : "Cancel"}
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
            {locale === "fa" ? "ایجاد کاربر" : "Create user"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
