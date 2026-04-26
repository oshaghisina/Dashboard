import { z } from "zod"

import type { DashboardRole } from "@/lib/types"

export interface SettingsMemberRecord {
  email: string
  fullName: string | null
  joinedAt: string
  role: DashboardRole
  userId: string
}

export interface SettingsInvitationRecord {
  createdAt: string
  email: string
  expiresAt: string
  id: string
  invitedBy: string
  role: "admin" | "editor" | "viewer"
  status: "accepted" | "expired" | "pending" | "revoked"
}

export const inviteMemberSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["admin", "editor", "viewer"]),
})

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "editor", "viewer"]),
  userId: z.string(),
})

export const revokeInvitationSchema = z.object({
  invitationId: z.string(),
})

export const removeMemberSchema = z.object({
  userId: z.string(),
})
