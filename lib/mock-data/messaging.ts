import type { MessagingPageState } from "@/features/messaging/messaging-state"
import type {
  MessagingMessageRecord,
  MessagingThreadRecord,
} from "@/features/messaging/messaging-types"

const viewer = {
  displayName: "Sina Oshaghi",
  email: "sina@registry.studio",
  id: "user_sina",
  membershipRole: "owner" as const,
  name: "Sina Oshaghi",
  organization: {
    id: "org_registry_studio",
    name: "Registry Studio",
    slug: "registry-studio",
  },
  role: "admin" as const,
  surface: "dashboard" as const,
}

const threads: MessagingThreadRecord[] = [
  {
    doctor: {
      email: "dr.khan@registry.studio",
      id: "doctor_khan",
      name: "Dr. Leila Khan",
      role: "doctor",
    },
    externalRoomId: null,
    id: "thread_followup",
    isUnread: true,
    lastMessageAt: "2026-04-11T09:25:00.000Z",
    lastMessagePreview: "Please confirm the updated follow-up schedule.",
    organizationId: "org_registry_studio",
    patient: {
      email: "emma@example.com",
      id: "patient_emma",
      name: "Emma Davis",
      role: "patient",
    },
    status: "awaiting_reply",
    subject: "Follow-up timing for Emma Davis",
  },
  {
    doctor: {
      email: "dr.santos@registry.studio",
      id: "doctor_santos",
      name: "Dr. Mateo Santos",
      role: "doctor",
    },
    externalRoomId: null,
    id: "thread_lab_results",
    isUnread: false,
    lastMessageAt: "2026-04-10T17:10:00.000Z",
    lastMessagePreview: "Results were shared with the patient and archived.",
    organizationId: "org_registry_studio",
    patient: {
      email: "noah@example.com",
      id: "patient_noah",
      name: "Noah Patel",
      role: "patient",
    },
    status: "active",
    subject: "Lab results handoff",
  },
  {
    doctor: {
      email: "dr.adams@registry.studio",
      id: "doctor_adams",
      name: "Dr. Priya Adams",
      role: "doctor",
    },
    externalRoomId: null,
    id: "thread_discharge",
    isUnread: false,
    lastMessageAt: "2026-04-09T13:40:00.000Z",
    lastMessagePreview: "Discharge checklist is complete.",
    organizationId: "org_registry_studio",
    patient: {
      email: "oliver@example.com",
      id: "patient_oliver",
      name: "Oliver Reed",
      role: "patient",
    },
    status: "closed",
    subject: "Discharge checklist completion",
  },
]

const messagesByThread: Record<string, MessagingMessageRecord[]> = {
  thread_followup: [
    {
      body: "Emma asked whether the Friday slot is still available.",
      createdAt: "2026-04-11T08:40:00.000Z",
      id: "msg_followup_1",
      isCurrentUser: false,
      sender: threads[0].doctor,
    },
    {
      body: "Please confirm the updated follow-up schedule.",
      createdAt: "2026-04-11T09:25:00.000Z",
      id: "msg_followup_2",
      isCurrentUser: false,
      sender: threads[0].patient,
    },
  ],
  thread_lab_results: [
    {
      body: "Results arrived and were reviewed by the care team.",
      createdAt: "2026-04-10T15:05:00.000Z",
      id: "msg_lab_1",
      isCurrentUser: false,
      sender: threads[1].doctor,
    },
    {
      body: "Results were shared with the patient and archived.",
      createdAt: "2026-04-10T17:10:00.000Z",
      id: "msg_lab_2",
      isCurrentUser: true,
      sender: viewer,
    },
  ],
  thread_discharge: [
    {
      body: "Final checklist has been signed off.",
      createdAt: "2026-04-09T11:00:00.000Z",
      id: "msg_discharge_1",
      isCurrentUser: false,
      sender: threads[2].doctor,
    },
    {
      body: "Discharge checklist is complete.",
      createdAt: "2026-04-09T13:40:00.000Z",
      id: "msg_discharge_2",
      isCurrentUser: true,
      sender: viewer,
    },
  ],
}

export function getMockMessagingPageState(): MessagingPageState {
  return {
    appName: "Care Messenger",
    backend: "mock",
    initialMessagesByThread: messagesByThread,
    initialThreadId: threads[0]?.id ?? null,
    initialThreads: threads,
    kind: "ready",
    viewer,
  }
}
