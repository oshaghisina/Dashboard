"use client"

import * as React from "react"
import { SettingsSectionNav } from "@/features/settings/settings-section-nav"
import {
  validateWorkspaceSettings,
  workspaceDocsModeOptions,
  workspaceFrameworkOptions,
  workspacePreviewLinkExpiryOptions,
  workspaceStyleOptions,
  type WorkspaceSettingsErrors,
  type WorkspaceSettingsValues,
} from "@/features/settings/workspace-settings-data"
import { AlertTriangle, CheckCircle2, LoaderCircle } from "lucide-react"

import { useTranslations } from "@/lib/i18n/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { FormSection } from "@/components/dashboard/form-section"
import { PageSection } from "@/components/dashboard/page-section"

type SaveState = "idle" | "saving" | "saved" | "error"

export interface WorkspaceSettingsPageProps {
  canEditSettings: boolean
  initialValues: WorkspaceSettingsValues
  organizationId: string
}

function countErrors(errors: WorkspaceSettingsErrors) {
  return Object.values(errors).filter(Boolean).length
}

function hasSettingsChanges(
  current: WorkspaceSettingsValues,
  baseline: WorkspaceSettingsValues
) {
  return (Object.keys(current) as Array<keyof WorkspaceSettingsValues>).some(
    (key) => current[key] !== baseline[key]
  )
}

export function WorkspaceSettingsPage({
  canEditSettings,
  initialValues,
  organizationId,
}: WorkspaceSettingsPageProps) {
  const t = useTranslations("dashboardContent.settings")
  const sharedT = useTranslations("dashboardContent.shared")
  const [savedValues, setSavedValues] = React.useState(initialValues)
  const [draftValues, setDraftValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<WorkspaceSettingsErrors>({})
  const [saveState, setSaveState] = React.useState<SaveState>("idle")
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)

  const isDirty = React.useMemo(() => {
    return hasSettingsChanges(draftValues, savedValues)
  }, [draftValues, savedValues])

  const errorCount = React.useMemo(() => countErrors(errors), [errors])
  const isSaving = saveState === "saving"
  const isReadOnly = !canEditSettings
  const getFieldError = React.useCallback(
    (value?: string) => (value ? t(`errors.${value}`) : undefined),
    [t]
  )

  const updateDraftValue = React.useCallback(
    <K extends keyof WorkspaceSettingsValues>(
      key: K,
      value: WorkspaceSettingsValues[K]
    ) => {
      setDraftValues((current) => {
        const nextValues = { ...current, [key]: value }

        if (Object.keys(errors).length > 0 || saveState === "error") {
          setErrors(validateWorkspaceSettings(nextValues))
        }

        if (saveState === "saved") {
          setSaveState("idle")
          setSaveMessage(null)
        }

        return nextValues
      })
    },
    [errors, saveState]
  )

  const handleReset = React.useCallback(() => {
    setDraftValues(savedValues)
    setErrors({})
    setSaveState("idle")
    setSaveMessage(null)
  }, [savedValues])

  const handleSave = React.useCallback(async () => {
    if (isReadOnly) {
      return
    }

    const nextErrors = validateWorkspaceSettings(draftValues)
    setErrors(nextErrors)

    if (countErrors(nextErrors) > 0) {
      setSaveState("error")
      return
    }

    setSaveState("saving")
    setSaveMessage(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 200))

      setSavedValues(draftValues)
      setDraftValues(draftValues)

      setErrors({})
      setSaveState("saved")
      setSaveMessage(t("alerts.savedTitle"))
    } catch (error) {
      setSaveState("error")
      setSaveMessage(
        error instanceof Error ? error.message : t("alerts.saveFailedTitle")
      )
    }
  }, [draftValues, isReadOnly, t])

  return (
    <DashboardPage
      title={t("page.title")}
      description={t("page.description")}
      actions={
        <>
          {isReadOnly ? (
            <Badge variant="outline">{t("badges.readOnly")}</Badge>
          ) : null}
          {isDirty ? (
            <Badge variant="secondary">{t("badges.unsavedChanges")}</Badge>
          ) : null}
          {saveState === "saved" && !isDirty ? (
            <Badge variant="outline">{sharedT("saved")}</Badge>
          ) : null}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          >
            {sharedT("reset")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving || isReadOnly}
          >
            {isSaving ? <LoaderCircle className="animate-spin" /> : null}
            {isSaving ? sharedT("saving") : sharedT("saveChanges")}
          </Button>
        </>
      }
    >
      <SettingsSectionNav />

      {isReadOnly ? (
        <Alert>
          <AlertTitle>{t("alerts.viewerTitle")}</AlertTitle>
          <AlertDescription>{t("alerts.viewerDescription")}</AlertDescription>
        </Alert>
      ) : null}

      {saveState === "error" && errorCount > 0 ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>
            {t("alerts.fieldsNeedAttention", { count: errorCount })}
          </AlertTitle>
          <AlertDescription>
            {t("alerts.fieldsNeedAttentionDescription")}
          </AlertDescription>
        </Alert>
      ) : null}

      {saveMessage && saveState !== "error" ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>{t("alerts.savedTitle")}</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      ) : null}

      {saveMessage && saveState === "error" && errorCount === 0 ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>{t("alerts.saveFailedTitle")}</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      ) : null}

      <PageSection
        title={t("sections.profileTitle")}
        description={t("sections.profileDescription")}
        contentClassName="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
      >
        <FormSection
          title={t("sections.identityTitle")}
          description={t("sections.identityDescription")}
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>{t("fields.workspaceName")}</FieldLabel>
                <Input
                  value={draftValues.workspaceName}
                  onChange={(event) =>
                    updateDraftValue("workspaceName", event.target.value)
                  }
                  disabled={isSaving || isReadOnly}
                  aria-invalid={Boolean(errors.workspaceName)}
                />
                <FieldDescription>
                  {t("fields.workspaceNameDescription")}
                </FieldDescription>
                <FieldError>{getFieldError(errors.workspaceName)}</FieldError>
              </Field>
              <Field>
                <FieldLabel>{t("fields.adminEmail")}</FieldLabel>
                <Input
                  type="email"
                  value={draftValues.adminEmail}
                  onChange={(event) =>
                    updateDraftValue("adminEmail", event.target.value)
                  }
                  disabled={isSaving || isReadOnly}
                  aria-invalid={Boolean(errors.adminEmail)}
                />
                <FieldDescription>
                  {t("fields.adminEmailDescription")}
                </FieldDescription>
                <FieldError>{getFieldError(errors.adminEmail)}</FieldError>
              </Field>
              <Field>
                <FieldLabel>{t("fields.registryUrl")}</FieldLabel>
                <Input
                  value={draftValues.registryUrl}
                  onChange={(event) =>
                    updateDraftValue("registryUrl", event.target.value)
                  }
                  disabled={isSaving || isReadOnly}
                  aria-invalid={Boolean(errors.registryUrl)}
                />
                <FieldDescription>
                  {t("fields.registryUrlDescription")}
                </FieldDescription>
                <FieldError>{getFieldError(errors.registryUrl)}</FieldError>
              </Field>
              <Field>
                <FieldLabel>{t("fields.workspaceSummary")}</FieldLabel>
                <Textarea
                  value={draftValues.summary}
                  onChange={(event) =>
                    updateDraftValue("summary", event.target.value)
                  }
                  className="min-h-28"
                  disabled={isSaving || isReadOnly}
                  aria-invalid={Boolean(errors.summary)}
                />
                <FieldDescription>
                  {t("fields.workspaceSummaryDescription")}
                </FieldDescription>
                <FieldError>{getFieldError(errors.summary)}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FormSection>

        <FormSection
          title={t("sections.deliveryTitle")}
          description={t("sections.deliveryDescription")}
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>{t("fields.defaultStyle")}</FieldLabel>
                <Select
                  value={draftValues.defaultStyle}
                  onValueChange={(value) =>
                    updateDraftValue(
                      "defaultStyle",
                      value as WorkspaceSettingsValues["defaultStyle"]
                    )
                  }
                  disabled={isSaving || isReadOnly}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("options.selectStyle")} />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {workspaceStyleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value === "new-york-v4"
                          ? "New York v4"
                          : option.value === "radix-nova"
                            ? "Radix Nova"
                            : "Base Nova"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {t("fields.defaultStyleDescription")}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>{t("fields.targetFramework")}</FieldLabel>
                <Select
                  value={draftValues.targetFramework}
                  onValueChange={(value) =>
                    updateDraftValue(
                      "targetFramework",
                      value as WorkspaceSettingsValues["targetFramework"]
                    )
                  }
                  disabled={isSaving || isReadOnly}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("options.selectFramework")} />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {workspaceFrameworkOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value === "manual"
                          ? t("options.manualExport")
                          : option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {t("fields.targetFrameworkDescription")}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>{t("fields.previewLinkExpiry")}</FieldLabel>
                <Select
                  value={draftValues.previewLinkExpiry}
                  onValueChange={(value) =>
                    updateDraftValue(
                      "previewLinkExpiry",
                      value as WorkspaceSettingsValues["previewLinkExpiry"]
                    )
                  }
                  disabled={isSaving || isReadOnly}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("options.selectExpiry")} />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {workspacePreviewLinkExpiryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {t("fields.previewLinkExpiryDescription")}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>{t("fields.publishingMode")}</FieldLabel>
                <FieldDescription>
                  {t("fields.publishingModeDescription")}
                </FieldDescription>
                <RadioGroup
                  value={draftValues.docsMode}
                  onValueChange={(value) =>
                    updateDraftValue(
                      "docsMode",
                      value as WorkspaceSettingsValues["docsMode"]
                    )
                  }
                  disabled={isSaving || isReadOnly}
                  className="gap-3 sm:grid-cols-2"
                >
                  {workspaceDocsModeOptions.map((option) => (
                    <FieldLabel key={option.value}>
                      <Field orientation="horizontal">
                        <RadioGroupItem value={option.value} />
                        <FieldContent>
                          <FieldTitle>
                            {option.value === "stable"
                              ? t("options.stablePublishing")
                              : t("options.previewWorkflow")}
                          </FieldTitle>
                          <FieldDescription>
                            {option.value === "stable"
                              ? t("options.stablePublishingDescription")
                              : t("options.previewWorkflowDescription")}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FormSection>
      </PageSection>

      <PageSection
        title={t("sections.accessTitle")}
        description={t("sections.accessDescription")}
        contentClassName="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
      >
        <FormSection
          title={t("sections.notificationsTitle")}
          description={t("sections.notificationsDescription")}
          footer={
            <div className="ml-auto text-sm text-muted-foreground">
              {t("sections.notificationsFooter")}
            </div>
          }
        >
          <FieldSet>
            <FieldGroup>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.publishDigest}
                  onCheckedChange={(checked) =>
                    updateDraftValue("publishDigest", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.publishDigest")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.publishDigestDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.releaseAlerts}
                  onCheckedChange={(checked) =>
                    updateDraftValue("releaseAlerts", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.releaseAlerts")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.releaseAlertsDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.syncAlerts}
                  onCheckedChange={(checked) =>
                    updateDraftValue("syncAlerts", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.previewSyncAlerts")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.previewSyncAlertsDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.changelogAnnouncements}
                  onCheckedChange={(checked) =>
                    updateDraftValue("changelogAnnouncements", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.changelogAnnouncements")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.changelogAnnouncementsDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FormSection>

        <FormSection
          title={t("sections.publishingTitle")}
          description={t("sections.publishingDescription")}
        >
          <FieldSet>
            <FieldGroup>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.allowEditorInvites}
                  onCheckedChange={(checked) =>
                    updateDraftValue("allowEditorInvites", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.allowEditorInvites")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.allowEditorInvitesDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.requireReviewBeforePublish}
                  onCheckedChange={(checked) =>
                    updateDraftValue(
                      "requireReviewBeforePublish",
                      Boolean(checked)
                    )
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.requireReview")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.requireReviewDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  checked={draftValues.enforceSso}
                  onCheckedChange={(checked) =>
                    updateDraftValue("enforceSso", Boolean(checked))
                  }
                  disabled={isSaving || isReadOnly}
                />
                <FieldContent>
                  <FieldTitle>{t("toggles.enforceSso")}</FieldTitle>
                  <FieldDescription>
                    {t("toggles.enforceSsoDescription")}
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FormSection>
      </PageSection>

      <PageSection title={t("sections.adminActionsTitle")}>
        <FormSection
          title={t("sections.dangerTitle")}
          description={t("sections.dangerDescription")}
          footer={
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button variant="outline" disabled>
                {t("actions.rotatePreviewLinks")}
              </Button>
              <Button variant="destructive" disabled>
                {t("actions.pauseWorkspace")}
              </Button>
            </div>
          }
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>{t("fields.organizationId")}</FieldLabel>
                <Input value={organizationId} readOnly disabled />
                <FieldDescription>
                  {t("fields.organizationIdDescription")}
                </FieldDescription>
              </Field>
              <Alert>
                <AlertTriangle />
                <AlertTitle>{t("sections.dangerTitle")}</AlertTitle>
                <AlertDescription>
                  {t("sections.dangerDescription")}
                </AlertDescription>
              </Alert>
            </FieldGroup>
          </FieldSet>
        </FormSection>
      </PageSection>
    </DashboardPage>
  )
}
