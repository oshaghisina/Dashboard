import { z } from "zod"

export type WorkspaceDocsMode = "stable" | "preview"
export type WorkspaceStyle = "new-york-v4" | "radix-nova" | "base-nova"
export type WorkspaceFramework = "next" | "vite" | "manual"
export type WorkspacePreviewLinkExpiry = "1" | "7" | "30"

export interface WorkspaceSettingsValues {
  workspaceName: string
  adminEmail: string
  registryUrl: string
  summary: string
  defaultStyle: WorkspaceStyle
  targetFramework: WorkspaceFramework
  docsMode: WorkspaceDocsMode
  publishDigest: boolean
  releaseAlerts: boolean
  syncAlerts: boolean
  changelogAnnouncements: boolean
  allowEditorInvites: boolean
  requireReviewBeforePublish: boolean
  enforceSso: boolean
  previewLinkExpiry: WorkspacePreviewLinkExpiry
}

export type WorkspaceSettingsErrors = Partial<
  Record<keyof WorkspaceSettingsValues, string>
>

export const defaultWorkspaceSettingsValues: WorkspaceSettingsValues = {
  workspaceName: "Registry Studio",
  adminEmail: "platform@registry.studio",
  registryUrl: "https://registry.studio/internal",
  summary:
    "Internal control plane for managing registry workspaces, publishing defaults, and adoption visibility across product teams.",
  defaultStyle: "new-york-v4",
  targetFramework: "next",
  docsMode: "stable",
  publishDigest: true,
  releaseAlerts: true,
  syncAlerts: true,
  changelogAnnouncements: false,
  allowEditorInvites: true,
  requireReviewBeforePublish: true,
  enforceSso: false,
  previewLinkExpiry: "7",
}

export const workspaceStyleOptions = [
  { value: "new-york-v4", label: "New York v4" },
  { value: "radix-nova", label: "Radix Nova" },
  { value: "base-nova", label: "Base Nova" },
] as const

export const workspaceFrameworkOptions = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
  { value: "manual", label: "Manual export" },
] as const

export const workspaceDocsModeOptions = [
  {
    value: "stable",
    label: "Stable-first publishing",
    description:
      "Keep docs and previews centered on reviewed releases and production-ready components.",
  },
  {
    value: "preview",
    label: "Preview-friendly workflow",
    description:
      "Surface beta and canary changes earlier so teams can validate design-system updates faster.",
  },
] as const

export const workspacePreviewLinkExpiryOptions = [
  { value: "1", label: "1 day" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
] as const

const workspaceSettingsSchema = z.object({
  workspaceName: z.string(),
  adminEmail: z.string(),
  registryUrl: z.string(),
  summary: z.string(),
  defaultStyle: z.enum(["new-york-v4", "radix-nova", "base-nova"]),
  targetFramework: z.enum(["next", "vite", "manual"]),
  docsMode: z.enum(["stable", "preview"]),
  publishDigest: z.boolean(),
  releaseAlerts: z.boolean(),
  syncAlerts: z.boolean(),
  changelogAnnouncements: z.boolean(),
  allowEditorInvites: z.boolean(),
  requireReviewBeforePublish: z.boolean(),
  enforceSso: z.boolean(),
  previewLinkExpiry: z.enum(["1", "7", "30"]),
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlPattern = /^https?:\/\//

export function validateWorkspaceSettings(
  values: WorkspaceSettingsValues
): WorkspaceSettingsErrors {
  const errors: WorkspaceSettingsErrors = {}

  if (!values.workspaceName.trim()) {
    errors.workspaceName = "workspaceNameRequired"
  } else if (values.workspaceName.trim().length < 3) {
    errors.workspaceName = "workspaceNameShort"
  }

  if (!values.adminEmail.trim()) {
    errors.adminEmail = "adminEmailRequired"
  } else if (!emailPattern.test(values.adminEmail)) {
    errors.adminEmail = "adminEmailInvalid"
  }

  if (!values.registryUrl.trim()) {
    errors.registryUrl = "registryUrlRequired"
  } else if (!urlPattern.test(values.registryUrl.trim())) {
    errors.registryUrl = "registryUrlInvalid"
  }

  if (values.summary.trim().length > 200) {
    errors.summary = "summaryTooLong"
  }

  return errors
}

export function parseWorkspaceSettingsValues(
  input: unknown
): WorkspaceSettingsValues {
  return workspaceSettingsSchema.parse(input)
}
