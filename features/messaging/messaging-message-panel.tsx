"use client"

import {
  formatMessagingSenderRole,
  formatMessagingThreadStatus,
} from "@/features/messaging/messaging-access"
import type {
  MessagingMessageRecord,
  MessagingSurface,
  MessagingThreadRecord,
} from "@/features/messaging/messaging-types"
import {
  AlertCircle,
  LoaderCircle,
  RefreshCcw,
  SendHorizonal,
} from "lucide-react"

import { useTranslations } from "@/lib/i18n/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

function getCounterpart(
  thread: MessagingThreadRecord,
  surface: MessagingSurface
) {
  if (surface === "doctor") {
    return thread.patient
  }

  if (surface === "patient") {
    return thread.doctor
  }

  return null
}

function getMessagePaneDescription(
  selectedThread: MessagingThreadRecord | null,
  surface: MessagingSurface,
  t: ReturnType<typeof useTranslations>
) {
  if (!selectedThread) {
    switch (surface) {
      case "dashboard":
        return t("messaging.shell.selectDashboard")
      case "doctor":
        return t("messaging.shell.selectDoctor")
      case "patient":
        return t("messaging.shell.selectPatient")
    }
  }

  if (surface === "dashboard") {
    return t("messaging.shell.dashboardThread", {
      doctor: selectedThread.doctor.name,
      patient: selectedThread.patient.name,
    })
  }

  const counterpart = getCounterpart(selectedThread, surface)
  return counterpart
    ? t("messaging.shell.counterpartThread", { name: counterpart.name })
    : t("messaging.shell.conversation")
}

function MessageComposer({
  actionLabel,
  body,
  disabled,
  isPending,
  onBodyChange,
  onSubmit,
  placeholder,
  pendingLabel,
}: {
  actionLabel: string
  body: string
  disabled?: boolean
  isPending: boolean
  onBodyChange: (value: string) => void
  onSubmit: () => void
  pendingLabel: string
  placeholder: string
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
      <Textarea
        value={body}
        onChange={(event) => onBodyChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-28 resize-none"
        disabled={disabled || isPending}
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={disabled || isPending || body.trim().length === 0}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <SendHorizonal />
          )}
          {isPending ? pendingLabel : actionLabel}
        </Button>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  timeFormatter,
}: {
  message: MessagingMessageRecord
  timeFormatter: Intl.DateTimeFormat
}) {
  const t = useTranslations()

  return (
    <div
      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          message.isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "border bg-background"
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span
            className={
              message.isCurrentUser
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            }
          >
            {message.sender.name} ·{" "}
            {t(formatMessagingSenderRole(message.sender.role))}
          </span>
          <span
            className={
              message.isCurrentUser
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            }
          >
            {timeFormatter.format(new Date(message.createdAt))}
          </span>
        </div>
        <p className="text-sm leading-6 whitespace-pre-wrap">{message.body}</p>
      </div>
    </div>
  )
}

export interface MessagingMessagePanelProps {
  isSending: boolean
  messages: MessagingMessageRecord[]
  messagesError: Error | undefined
  messagesLoading: boolean
  onReplyBodyChange: (value: string) => void
  onSendReply: () => void
  replyBody: string
  selectedThread: MessagingThreadRecord | null
  surface: MessagingSurface
  threadTimeFormatter: Intl.DateTimeFormat
}

export function MessagingMessagePanel({
  isSending,
  messages,
  messagesError,
  messagesLoading,
  onReplyBodyChange,
  onSendReply,
  replyBody,
  selectedThread,
  surface,
  threadTimeFormatter,
}: MessagingMessagePanelProps) {
  const t = useTranslations()

  return (
    <Card className="gap-4">
      <CardHeader className="gap-3 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>
              {selectedThread
                ? selectedThread.subject
                : t("messaging.shell.conversationDetail")}
            </CardTitle>
            <CardDescription>
              {getMessagePaneDescription(selectedThread, surface, t)}
            </CardDescription>
          </div>
          {selectedThread ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Badge variant="outline">
                {t(formatMessagingThreadStatus(selectedThread.status))}
              </Badge>
              <Badge variant="secondary">
                {threadTimeFormatter.format(
                  new Date(selectedThread.lastMessageAt)
                )}
              </Badge>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {messagesError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{t("messaging.errors.actionFailed")}</AlertTitle>
            <AlertDescription>{messagesError.message}</AlertDescription>
          </Alert>
        ) : null}

        <ScrollArea className="h-[460px] rounded-xl border bg-muted/20 p-4">
          <div className="space-y-4 pr-4">
            {!selectedThread ? (
              <div className="flex min-h-[340px] items-center justify-center text-center">
                <div className="space-y-3">
                  <RefreshCcw className="mx-auto size-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {t("messaging.shell.selectThreadTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("messaging.shell.selectThreadDescription")}
                    </p>
                  </div>
                </div>
              </div>
            ) : messagesLoading && messages.length === 0 ? (
              <div className="flex min-h-[340px] items-center justify-center text-sm text-muted-foreground">
                {t("messaging.shell.loadingMessages")}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[340px] items-center justify-center text-sm text-muted-foreground">
                {t("messaging.shell.noMessagesDescription")}
              </div>
            ) : (
              messages.map((message) => {
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    timeFormatter={threadTimeFormatter}
                  />
                )
              })
            )}
          </div>
        </ScrollArea>

        {surface !== "dashboard" ? (
          <>
            <Separator />
            <MessageComposer
              actionLabel={t("messaging.shell.sendReply")}
              body={replyBody}
              onBodyChange={onReplyBodyChange}
              onSubmit={onSendReply}
              isPending={isSending}
              disabled={!selectedThread}
              pendingLabel={t("messaging.shell.sending")}
              placeholder={
                surface === "doctor"
                  ? t("messaging.shell.doctorReplyPlaceholder")
                  : t("messaging.shell.patientReplyPlaceholder")
              }
            />
          </>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            {t("messaging.shell.dashboardReadonly")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
