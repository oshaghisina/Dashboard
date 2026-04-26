import type {
  MessagingSenderRole,
  MessagingSurface,
  MessagingThreadStatus,
} from "@/features/messaging/messaging-types"

import type { DashboardRole } from "@/lib/types"

export function formatMessagingThreadStatus(status: MessagingThreadStatus) {
  return `messaging.threadStatus.${status}` as const
}

export function formatMessagingSenderRole(role: MessagingSenderRole) {
  return `messaging.roles.${role}` as const
}

export function surfaceRequiresOrgMembership(surface: MessagingSurface) {
  return surface === "dashboard" || surface === "doctor"
}

export function canAccessMessagingSurface(
  surface: MessagingSurface,
  membershipRole: DashboardRole | null
) {
  if (surfaceRequiresOrgMembership(surface)) {
    return membershipRole !== null
  }

  return membershipRole === null
}

export function getViewerRoleForSurface(
  surface: MessagingSurface,
  membershipRole: DashboardRole | null
): MessagingSenderRole | null {
  if (!canAccessMessagingSurface(surface, membershipRole)) {
    return null
  }

  switch (surface) {
    case "dashboard":
      return "admin"
    case "doctor":
      return "doctor"
    case "patient":
      return "patient"
  }
}

export function getThreadStatusAfterSend(senderRole: MessagingSenderRole) {
  switch (senderRole) {
    case "patient":
      return "awaiting_reply" as const
    case "doctor":
    case "admin":
      return "active" as const
  }
}

export function getDisplayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "User"

  return localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    .join(" ")
}
