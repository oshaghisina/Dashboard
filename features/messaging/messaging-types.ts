import type { DashboardRole } from "@/lib/types"

export type MessagingBackend = "matrix" | "mock"
export type MessagingSurface = "dashboard" | "doctor" | "patient"
export type MessagingThreadStatus = "active" | "awaiting_reply" | "closed"
export type MessagingSenderRole = "admin" | "doctor" | "patient"

export interface MessagingParticipantRecord {
  email: string
  id: string
  name: string
  role: MessagingSenderRole
}

export interface MessagingThreadRecord {
  doctor: MessagingParticipantRecord
  externalRoomId: string | null
  id: string
  isUnread: boolean
  lastMessageAt: string
  lastMessagePreview: string
  organizationId: string
  patient: MessagingParticipantRecord
  status: MessagingThreadStatus
  subject: string
}

export interface MessagingMessageRecord {
  body: string
  createdAt: string
  id: string
  isCurrentUser: boolean
  sender: MessagingParticipantRecord
}

export interface MessagingCreateThreadInput {
  body: string
  subject: string
}

export interface MessagingThreadFilters {
  status?: MessagingThreadStatus | "all"
}

export interface MessagingViewer {
  displayName: string
  email: string
  id: string
  membershipRole?: DashboardRole
  organization: {
    id: string
    name: string
    slug: string
  }
  role: MessagingSenderRole
  surface: MessagingSurface
}

export interface MessagingThreadMutationResult {
  message: MessagingMessageRecord
  thread: MessagingThreadRecord
}
