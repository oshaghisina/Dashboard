"use client"

import * as React from "react"
import { getThreadStatusAfterSend } from "@/features/messaging/messaging-access"
import type { MessagingPageState } from "@/features/messaging/messaging-state"
import type {
  MessagingSurface,
  MessagingThreadStatus,
} from "@/features/messaging/messaging-types"
import {
  MessagingMessagePanel,
} from "@/features/messaging/messaging-message-panel"
import {
  MessagingThreadPanel,
} from "@/features/messaging/messaging-thread-panel"

import { useLocale, useTranslations } from "@/lib/i18n/client"

export interface MessagingExperienceProps {
  pageState: MessagingPageState
  surface: MessagingSurface
}

export function MessagingExperience({
  pageState,
  surface,
}: MessagingExperienceProps) {
  const locale = useLocale()
  const t = useTranslations()
  const threadTimeFormatter = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }, [locale])
  const statusOptions = React.useMemo(
    () =>
      [
        { label: t("messaging.filters.all"), value: "all" },
        { label: t("messaging.filters.active"), value: "active" },
        {
          label: t("messaging.filters.awaiting_reply"),
          value: "awaiting_reply",
        },
        { label: t("messaging.filters.closed"), value: "closed" },
      ] as const,
    [t]
  )
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | MessagingThreadStatus
  >("all")
  const [selectedThreadId, setSelectedThreadId] = React.useState(
    pageState.kind === "ready" ? pageState.initialThreadId : null
  )
  const [replyBody, setReplyBody] = React.useState("")
  const [newThreadSubject, setNewThreadSubject] = React.useState("")
  const [newThreadBody, setNewThreadBody] = React.useState("")
  const [feedback, setFeedback] = React.useState<{
    message: string
    tone: "error" | "success"
  } | null>(null)
  const [threads, setThreads] = React.useState(
    pageState.kind === "ready" ? pageState.initialThreads : []
  )
  const [messagesByThread, setMessagesByThread] = React.useState(
    pageState.kind === "ready" ? pageState.initialMessagesByThread : {}
  )
  const [isSending, startSendTransition] = React.useTransition()
  const [isCreating, startCreateTransition] = React.useTransition()

  const visibleThreads = React.useMemo(() => {
    if (statusFilter === "all") {
      return threads
    }

    return threads.filter((thread) => thread.status === statusFilter)
  }, [statusFilter, threads])

  const selectedThread =
    visibleThreads.find((thread) => thread.id === selectedThreadId) ?? null
  const messages = selectedThreadId
    ? messagesByThread[selectedThreadId] ?? []
    : []

  React.useEffect(() => {
    if (visibleThreads.length === 0) {
      setSelectedThreadId(null)
      return
    }

    if (!selectedThreadId) {
      setSelectedThreadId(visibleThreads[0]?.id ?? null)
      return
    }

    const stillVisible = visibleThreads.some((thread) => {
      return thread.id === selectedThreadId
    })

    if (!stillVisible) {
      setSelectedThreadId(visibleThreads[0]?.id ?? null)
    }
  }, [selectedThreadId, visibleThreads])

  React.useEffect(() => {
    if (!selectedThreadId || messages.length === 0) {
      return
    }

    setThreads((current) =>
      current.map((thread) =>
        thread.id === selectedThreadId ? { ...thread, isUnread: false } : thread
      )
    )
  }, [messages.length, selectedThreadId])

  const createThread = React.useCallback(() => {
    if (pageState.kind !== "ready") {
      return
    }

    const subject = newThreadSubject.trim()
    const body = newThreadBody.trim()

    if (!subject || !body) {
      return
    }

    setFeedback(null)

    startCreateTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))

      const createdAt = new Date().toISOString()
      const threadId = `thread_${crypto.randomUUID()}`
      const newThread = {
        doctor: {
          email: "dr.demo@registry.studio",
          id: "doctor_demo",
          name: "Dr. Demo",
          role: "doctor" as const,
        },
        externalRoomId: null,
        id: threadId,
        isUnread: false,
        lastMessageAt: createdAt,
        lastMessagePreview: body,
        organizationId: pageState.viewer.organization.id,
        patient: {
          email: "new.patient@example.com",
          id: `patient_${crypto.randomUUID()}`,
          name: "New Patient",
          role: "patient" as const,
        },
        status: "active" as const,
        subject,
      }
      const firstMessage = {
        body,
        createdAt,
        id: `message_${crypto.randomUUID()}`,
        isCurrentUser: true,
        sender: {
          email: pageState.viewer.email,
          id: pageState.viewer.id,
          name: pageState.viewer.displayName,
          role: pageState.viewer.role,
        },
      }

      setThreads((current) => [newThread, ...current])
      setMessagesByThread((current) => ({
        ...current,
        [threadId]: [firstMessage],
      }))
      setSelectedThreadId(threadId)
      setNewThreadSubject("")
      setNewThreadBody("")
      setFeedback({
        message: t("messaging.shell.threadCreated"),
        tone: "success",
      })
    })
  }, [newThreadBody, newThreadSubject, pageState, t])

  const sendReply = React.useCallback(() => {
    if (pageState.kind !== "ready" || !selectedThreadId) {
      return
    }

    const body = replyBody.trim()

    if (!body) {
      return
    }

    setFeedback(null)
    setReplyBody("")

    startSendTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120))

      const createdAt = new Date().toISOString()
      const message = {
        body,
        createdAt,
        id: `message_${crypto.randomUUID()}`,
        isCurrentUser: true,
        sender: {
          email: pageState.viewer.email,
          id: pageState.viewer.id,
          name: pageState.viewer.displayName,
          role: pageState.viewer.role,
        },
      }

      setMessagesByThread((current) => ({
        ...current,
        [selectedThreadId]: [...(current[selectedThreadId] ?? []), message],
      }))
      setThreads((current) =>
        current.map((thread) =>
          thread.id === selectedThreadId
            ? {
                ...thread,
                isUnread: false,
                lastMessageAt: createdAt,
                lastMessagePreview: body,
                status: getThreadStatusAfterSend(pageState.viewer.role),
              }
            : thread
        )
      )
    })
  }, [pageState, replyBody, selectedThreadId])

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <MessagingThreadPanel
        feedback={feedback}
        isCreating={isCreating}
        newThreadBody={newThreadBody}
        newThreadSubject={newThreadSubject}
        onBodyChange={setNewThreadBody}
        onCreateThread={createThread}
        onSelectThread={setSelectedThreadId}
        onSubjectChange={setNewThreadSubject}
        pageState={pageState}
        selectedThreadId={selectedThreadId}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        surface={surface}
        threadTimeFormatter={threadTimeFormatter}
        threadsError={undefined}
        threadsLoading={false}
        visibleThreads={visibleThreads}
      />

      <MessagingMessagePanel
        isSending={isSending}
        messages={messages}
        messagesError={undefined}
        messagesLoading={false}
        onReplyBodyChange={setReplyBody}
        onSendReply={sendReply}
        replyBody={replyBody}
        selectedThread={selectedThread}
        surface={surface}
        threadTimeFormatter={threadTimeFormatter}
      />
    </div>
  )
}
