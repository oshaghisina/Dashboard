"use client"

import * as React from "react"
import Link from "next/link"
import { Info, LifeBuoy, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { useTickets } from "@/features/tickets/tickets-provider"
import {
  getTicketCategoryLabel,
  getTicketPriorityLabel,
} from "@/features/tickets/ticket-presenters"
import { localizePathname } from "@/lib/i18n/routing"
import type { TicketCategory, TicketPriority } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { FormSection } from "@/components/dashboard/form-section"
import { PageSection } from "@/components/dashboard/page-section"

const categories: TicketCategory[] = [
  "connection_issue",
  "config_help",
  "billing",
  "refund",
  "account_access",
  "app_setup",
  "other",
]

const priorities: TicketPriority[] = ["low", "normal", "high"]

const copy = {
  en: {
    back: "Back to tickets",
    category: "Category",
    description: "Send a clear support request and we’ll keep the conversation in one trackable thread.",
    guidance: "Include the config name, server location, device, and what you already tried. That helps support reply faster.",
    message: "Message",
    messageError: "Write a short explanation of the issue.",
    messagePlaceholder: "Describe the problem, when it started, and what device or app you are using.",
    priority: "Priority",
    responseHint: "Most VPN support tickets receive a reply in one working day in this demo flow.",
    sending: "Creating ticket...",
    subject: "Subject",
    subjectError: "Add a short subject so the ticket is easy to identify.",
    subjectPlaceholder: "Example: Amsterdam config works on phone but not on laptop",
    submit: "Create ticket",
    success: "Your ticket was created.",
    title: "New support ticket",
  },
  fa: {
    back: "بازگشت به تیکت‌ها",
    category: "دسته‌بندی",
    description: "درخواست پشتیبانی را واضح ثبت کنید تا گفتگو در یک تیکت قابل پیگیری ادامه پیدا کند.",
    guidance: "نام کانفیگ، لوکیشن سرور، دستگاه و کارهایی که امتحان کرده‌اید را بنویسید تا پشتیبانی سریع‌تر پاسخ دهد.",
    message: "پیام",
    messageError: "توضیح کوتاهی درباره مشکل بنویسید.",
    messagePlaceholder: "مشکل را توضیح دهید، زمان شروع آن را بگویید و ذکر کنید از چه دستگاه یا اپی استفاده می‌کنید.",
    priority: "اولویت",
    responseHint: "در این نسخه دمو، بیشتر تیکت‌های VPN طی یک روز کاری پاسخ می‌گیرند.",
    sending: "در حال ساخت تیکت...",
    subject: "موضوع",
    subjectError: "برای قابل پیگیری بودن تیکت، یک موضوع کوتاه وارد کنید.",
    subjectPlaceholder: "مثال: کانفیگ آمستردام روی لپ‌تاپ وصل نمی‌شود",
    submit: "ایجاد تیکت",
    success: "تیکت شما ساخته شد.",
    title: "تیکت جدید پشتیبانی",
  },
} as const

export function TicketNewPage() {
  const router = useRouter()
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()
  const { createTicket } = useTickets()
  const text = copy[locale]
  const [subject, setSubject] = React.useState("")
  const [category, setCategory] = React.useState<TicketCategory>("connection_issue")
  const [priority, setPriority] = React.useState<TicketPriority>("normal")
  const [messageBody, setMessageBody] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<{ messageBody?: string; subject?: string }>({})

  const handleSubmit = async () => {
    const nextErrors: { messageBody?: string; subject?: string } = {}

    if (!subject.trim()) {
      nextErrors.subject = text.subjectError
    }

    if (!messageBody.trim()) {
      nextErrors.messageBody = text.messageError
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    const ticket = createTicket({ category, messageBody, priority, subject })
    addToast(text.success, "success")
    router.push(localizePathname(`/dashboard/tickets/${ticket.id}`, locale))
  }

  return (
    <DashboardPage
      title={text.title}
      description={text.description}
      actions={
        <Button asChild variant="outline">
          <Link href={localizePathname("/dashboard/tickets", locale)}>
            {text.back}
          </Link>
        </Button>
      }
    >
      <PageSection>
        <Alert>
          <Info className="size-4" />
          <AlertDescription>{text.responseHint}</AlertDescription>
        </Alert>
      </PageSection>

      <PageSection>
        <FormSection
          title={text.title}
          description={text.guidance}
          footer={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button asChild variant="outline">
                <Link href={localizePathname("/dashboard/tickets", locale)}>
                  {text.back}
                </Link>
              </Button>
              <Button type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin" /> : <LifeBuoy className="size-4" />}
                {isSubmitting ? text.sending : text.submit}
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="ticket-subject">
                  {text.subject}
                </label>
                <Input
                  id="ticket-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={text.subjectPlaceholder}
                  aria-invalid={errors.subject ? "true" : "false"}
                />
                {errors.subject ? (
                  <p className="text-sm text-destructive">{errors.subject}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="ticket-message">
                  {text.message}
                </label>
                <Textarea
                  id="ticket-message"
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  placeholder={text.messagePlaceholder}
                  className="min-h-48 resize-none"
                  aria-invalid={errors.messageBody ? "true" : "false"}
                />
                {errors.messageBody ? (
                  <p className="text-sm text-destructive">{errors.messageBody}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{text.category}</label>
                <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {getTicketCategoryLabel(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{text.priority}</label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((item) => (
                      <SelectItem key={item} value={item}>
                        {getTicketPriorityLabel(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </FormSection>
      </PageSection>
    </DashboardPage>
  )
}
