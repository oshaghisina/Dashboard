import type {
  MessagingBackend,
  MessagingMessageRecord,
  MessagingThreadRecord,
  MessagingViewer,
} from "@/features/messaging/messaging-types"

export interface MessagingPageReadyState {
  appName: string
  backend: MessagingBackend
  initialMessagesByThread: Record<string, MessagingMessageRecord[]>
  initialThreadId: string | null
  initialThreads: MessagingThreadRecord[]
  kind: "ready"
  viewer: MessagingViewer
}

export interface MessagingPageConfigurationErrorState {
  appName: string
  backend: MessagingBackend
  kind: "configuration-error"
  message: string
  viewer: MessagingViewer
}

export type MessagingPageState =
  | MessagingPageReadyState
  | MessagingPageConfigurationErrorState

