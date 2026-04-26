import type { DashboardRole } from "@/lib/types"
import type {
  SettingsInvitationRecord,
  SettingsMemberRecord,
} from "@/features/settings/settings-members-data"
import {
  defaultWorkspaceSettingsValues,
  type WorkspaceSettingsValues,
} from "@/features/settings/workspace-settings-data"

export const mockOrganization = {
  id: "org_registry_studio",
  name: "Registry Studio",
}

export const mockCurrentUser = {
  id: "user_sina",
  email: "sina@registry.studio",
  fullName: "Sina Oshaghi",
  role: "owner" as DashboardRole,
}

export const mockWorkspaceSettings: WorkspaceSettingsValues = {
  ...defaultWorkspaceSettingsValues,
  adminEmail: mockCurrentUser.email,
  workspaceName: mockOrganization.name,
  registryUrl: "https://registry.studio/frontend-demo",
  summary:
    "Frontend-only extraction of the dashboard shell for rapid UI development without backend setup.",
}

export const mockMembers: SettingsMemberRecord[] = [
  {
    email: "sina@registry.studio",
    fullName: "Sina Oshaghi",
    joinedAt: "2026-03-10T09:30:00.000Z",
    role: "owner",
    userId: "user_sina",
  },
  {
    email: "ava@registry.studio",
    fullName: "Ava Rahimi",
    joinedAt: "2026-03-12T11:00:00.000Z",
    role: "admin",
    userId: "user_ava",
  },
  {
    email: "liam@registry.studio",
    fullName: "Liam Cooper",
    joinedAt: "2026-03-14T14:00:00.000Z",
    role: "editor",
    userId: "user_liam",
  },
  {
    email: "maya@registry.studio",
    fullName: "Maya Chen",
    joinedAt: "2026-03-18T16:20:00.000Z",
    role: "viewer",
    userId: "user_maya",
  },
]

export const mockInvitations: SettingsInvitationRecord[] = [
  {
    createdAt: "2026-04-05T10:00:00.000Z",
    email: "alex@registry.studio",
    expiresAt: "2026-04-12T10:00:00.000Z",
    id: "invite_alex",
    invitedBy: "Sina Oshaghi",
    role: "editor",
    status: "pending",
  },
  {
    createdAt: "2026-04-02T09:00:00.000Z",
    email: "nina@registry.studio",
    expiresAt: "2026-04-09T09:00:00.000Z",
    id: "invite_nina",
    invitedBy: "Ava Rahimi",
    role: "viewer",
    status: "expired",
  },
]

