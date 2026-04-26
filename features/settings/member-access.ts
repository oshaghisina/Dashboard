import type { DashboardRole } from "@/lib/types"

export type InvitationRole = Exclude<DashboardRole, "owner">

export const invitationRoleOptions: Array<{
  value: InvitationRole
  label: string
  description: string
}> = [
  {
    value: "admin",
    label: "Admin",
    description: "Can manage members, invitations, and workspace operations.",
  },
  {
    value: "editor",
    label: "Editor",
    description:
      "Can update workspace content and configuration, but not members.",
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Can review dashboard data without changing product state.",
  },
]

export function canManageMembers(role: DashboardRole) {
  return role === "owner" || role === "admin"
}

export function canEditNonOwnerMember(
  currentUserRole: DashboardRole,
  targetRole: DashboardRole
) {
  return canManageMembers(currentUserRole) && targetRole !== "owner"
}

export function formatMemberRole(role: DashboardRole | InvitationRole) {
  switch (role) {
    case "owner":
      return "Owner"
    case "admin":
      return "Admin"
    case "editor":
      return "Editor"
    case "viewer":
    default:
      return "Viewer"
  }
}

export function formatInvitationStatus(
  status: "accepted" | "expired" | "pending" | "revoked"
) {
  switch (status) {
    case "accepted":
      return "Accepted"
    case "expired":
      return "Expired"
    case "revoked":
      return "Revoked"
    case "pending":
    default:
      return "Pending"
  }
}
