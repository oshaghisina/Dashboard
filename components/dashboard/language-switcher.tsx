"use client"

import { Languages } from "lucide-react"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full"
      onClick={() => setLocale(locale === "en" ? "fa" : "en")}
    >
      <Languages className="size-4" />
      <span>{locale === "en" ? "FA" : "EN"}</span>
    </Button>
  )
}
