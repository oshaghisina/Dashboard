"use client"

import * as React from "react"
import {
  formatMessagingSenderRole,
  formatMessagingThreadStatus,
} from "@/features/messaging/messaging-access"
import type { MessagingPageState } from "@/features/messaging/messaging-state"
import type {
  MessagingParticipantRecord,
  MessagingSurface,
  MessagingThreadRecord,
  MessagingThreadStatus,
} from "@/features/messaging/messaging-types"
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  MessageSquareMore,
  Stethoscope,
  UserRound,
} from "lucide-react"

import { useTranslations } from "@/lib/i18n/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

function getParticipantInitials(participant: MessagingParticipantRecord) {
  return participant.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

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

function getThreadMetaLine(
  thread: MessagingThreadRecord,
  surface: MessagingSurface,
  t: ReturnType<typeof useTranslations>
) {
  if (surface === "dashboard") {
    return `${thread.patient.name} → ${thread.doctor.name}`
  }

  const counterpart = getCounterpart(thread, surface)
  return counterpart
    ? `${t(formatMessagingSenderRole(counterpart.role))} ${t("messaging.shell.conversation")}`
    : t("messaging.shell.conversation")
}

function getConfigurationErrorTitle(
  pageState: Extract<MessagingPageState, { kind: "configuration-error" }>,
  t: ReturnType<typeof useTranslations>
) {
  if (pageState.backend === "matrix") {
    return t("messaging.errors.matrixUnavailable")
  }

  return t("messaging.errors.appNotReady", { appName: pageState.appName })
}

function NewThreadComposer({
  body,
  disabled,
  isPending,
  onBodyChange,
  onSubmit,
  onSubjectChange,
  pendingLabel,
  subject,
}: {
  body: string
  disabled?: boolean
  isPending: boolean
  onBodyChange: (value: string) => void
  onSubmit: () => void
  onSubjectChange: (value: string) => void
  pendingLabel: string
  subject: string
}) {
  const t = useTranslations()

  return (
    <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="conversation-subject">
          {t("messaging.shell.subject")}
        </label>
        <Input
          id="conversation-subject"
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          placeholder={t("messaging.shell.subjectPlaceholder")}
          disabled={disabled || isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="conversation-message">
          {t("messaging.shell.firstMessage")}
        </label>
        <Textarea
          id="conversation-message"
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder={t("messaging.shell.firstMessagePlaceholder")}
          className="min-h-32 resize-none"
          disabled={disabled || isPending}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={
            disabled ||
            isPending ||
            subject.trim().length === 0 ||
            body.trim().length === 0
          }
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <MessageSquareMore />
          )}
          {isPending ? pendingLabel : t("messaging.shell.startConversation")}
        </Button>
      </div>
    </div>
  )
}

function ThreadListItem({
  isActive,
  onClick,
  surface,
  thread,
  timeFormatter,
}: {
  isActive: boolean
  onClick: () => void
  surface: MessagingSurface
  thread: MessagingThreadRecord
  timeFormatter: Intl.DateTimeFormat
}) {
  const t = useTranslations()
  const counterpart = getCounterpart(thread, surface)
  const title = counterpart ? counterpart.name : thread.subject
  const Icon = counterpart?.role === "doctor" ? Stethoscope : UserRound

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        isActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-accent/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback>
            {getParticipantInitials(counterpart ?? thread.patient)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {surface !== "dashboard" ? (
                  <Icon className="size-4 text-muted-foreground" />
                ) : null}
                <p className="truncate text-sm font-semibold">{title}</p>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {thread.subject}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {thread.isUnread ? (
                <Badge variant="default">{t("messaging.shell.unread")}</Badge>
              ) : null}
              <Badge variant="outline">
                {t(formatMessagingThreadStatus(thread.status))}
              </Badge>
            </div>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {thread.lastMessagePreview}
          </p>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="truncate">
              {getThreadMetaLine(thread, surface, t)}
            </span>
            <span className="shrink-0">
              {timeFormatter.format(new Date(thread.lastMessageAt))}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export interface MessagingThreadPanelProps {
  feedback: { message: string; tone: "error" | "success" } | null
  isCreating: boolean
  newThreadBody: string
  newThreadSubject: string
  onBodyChange: (value: string) => void
  onCreateThread: () => void
  onSelectThread: (threadId: string) => void
  onSubjectChange: (value: string) => void
  pageState: MessagingPageState
  selectedThreadId: string | null
  setStatusFilter: (value: "all" | MessagingThreadStatus) => void
  statusFilter: "all" | MessagingThreadStatus
  statusOptions: ReadonlyArray<{
    label: string
    value: "all" | MessagingThreadStatus
  }>
  surface: MessagingSurface
  threadTimeFormatter: Intl.DateTimeFormat
  threadsError: Error | undefined
  threadsLoading: boolean
  visibleThreads: MessagingThreadRecord[]
}

export function MessagingThreadPanel({
  feedback,
  isCreating,
  newThreadBody,
  newThreadSubject,
  onBodyChange,
  onCreateThread,
  onSelectThread,
  onSubjectChange,
  pageState,
  selectedThreadId,
  setStatusFilter,
  statusFilter,
  statusOptions,
  surface,
  threadTimeFormatter,
  threadsError,
  threadsLoading,
  visibleThreads,
}: MessagingThreadPanelProps) {
  const t = useTranslations()

  return (
    <Card className="gap-4">
      <CardHeader className="gap-4 border-b">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {t("messaging.shell.conversations")}
            </CardTitle>
            <Badge variant="outline">
              {pageState.backend === "mock"
                ? t("messaging.transport.mock")
                : t("messaging.transport.matrix")}
            </Badge>
          </div>
          <CardDescription>
            {surface === "dashboard"
              ? t("messaging.shell.transportDescriptionDashboard")
              : surface === "doctor"
                ? t("messaging.shell.transportDescriptionDoctor")
                : t("messaging.shell.transportDescriptionPatient")}
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const value = option.value as "all" | MessagingThreadStatus
            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={statusFilter === value ? "default" : "outline"}
                onClick={() => setStatusFilter(value)}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {pageState.kind === "configuration-error" ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{getConfigurationErrorTitle(pageState, t)}</AlertTitle>
            <AlertDescription>{pageState.message}</AlertDescription>
          </Alert>
        ) : null}

        {feedback ? (
          <Alert
            variant={feedback.tone === "error" ? "destructive" : "default"}
          >
            {feedback.tone === "error" ? <AlertCircle /> : <CheckCircle2 />}
            <AlertTitle>
              {feedback.tone === "error"
                ? t("messaging.errors.actionFailed")
                : t("messaging.shell.updated")}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        ) : null}

        {surface === "patient" && pageState.kind === "ready" ? (
          <NewThreadComposer
            subject={newThreadSubject}
            body={newThreadBody}
            onSubjectChange={onSubjectChange}
            onBodyChange={onBodyChange}
            onSubmit={onCreateThread}
            isPending={isCreating}
            pendingLabel={t("messaging.shell.creating")}
          />
        ) : null}

        {threadsError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{t("messaging.errors.actionFailed")}</AlertTitle>
            <AlertDescription>{threadsError.message}</AlertDescription>
          </Alert>
        ) : null}

        <ScrollArea className="h-[540px]">
          <div className="space-y-3 pr-4">
            {threadsLoading && visibleThreads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("messaging.shell.loadingThreads")}
              </p>
            ) : null}

            {visibleThreads.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-medium">
                  {t("messaging.shell.noThreadsTitle")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {surface === "patient"
                    ? t("messaging.shell.patientNoThreadsDescription")
                    : surface === "doctor"
                      ? t("messaging.shell.doctorNoThreadsDescription")
                      : t("messaging.shell.dashboardNoThreadsDescription")}
                </p>
              </div>
            ) : null}

            {visibleThreads.map((thread) => {
              return (
                <ThreadListItem
                  key={thread.id}
                  thread={thread}
                  surface={surface}
                  isActive={thread.id === selectedThreadId}
                  onClick={() => onSelectThread(thread.id)}
                  timeFormatter={threadTimeFormatter}
                />
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
