"use client"

import * as React from "react"
import {
  canEditNonOwnerMember,
  invitationRoleOptions,
  type InvitationRole,
} from "@/features/settings/member-access"
import {
  inviteMemberSchema,
  type SettingsInvitationRecord,
  type SettingsMemberRecord,
} from "@/features/settings/settings-members-data"
import { SettingsSectionNav } from "@/features/settings/settings-section-nav"
import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  MailPlus,
  ShieldCheck,
  UserMinus,
} from "lucide-react"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import type { DashboardRole } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export interface SettingsMembersPageProps {
  canManageMembers: boolean
  currentUserId: string
  invitations: SettingsInvitationRecord[]
  members: SettingsMemberRecord[]
  organizationName: string
  role: DashboardRole
}

function buildRoleDrafts(records: SettingsMemberRecord[]) {
  return Object.fromEntries(
    records
      .filter((member) => member.role !== "owner")
      .map((member) => [member.userId, member.role as InvitationRole])
  )
}

function waitForUi(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function SettingsMembersPage({
  canManageMembers,
  currentUserId,
  invitations,
  members,
  organizationName,
  role,
}: SettingsMembersPageProps) {
  const locale = useLocale()
  const t = useTranslations("dashboardContent.members")
  const sharedT = useTranslations("dashboardContent.shared")
  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
      }),
    [locale]
  )
  const formatRole = React.useCallback(
    (value: DashboardRole | InvitationRole) => t(`roles.${value}`),
    [t]
  )
  const formatInvitationState = React.useCallback(
    (value: "accepted" | "expired" | "pending" | "revoked") =>
      t(`invitationStatus.${value}`),
    [t]
  )
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<InvitationRole>("viewer")
  const [feedback, setFeedback] = React.useState<{
    tone: "error" | "success"
    message: string
  } | null>(null)
  const [memberRecords, setMemberRecords] =
    React.useState<SettingsMemberRecord[]>(members)
  const [invitationRecords, setInvitationRecords] =
    React.useState<SettingsInvitationRecord[]>(invitations)
  const [isInviting, startInviteTransition] = React.useTransition()
  const [pendingMemberAction, setPendingMemberAction] = React.useState<
    string | null
  >(null)
  const [pendingInvitationAction, setPendingInvitationAction] = React.useState<
    string | null
  >(null)
  const [roleDrafts, setRoleDrafts] = React.useState<
    Record<string, InvitationRole>
  >(() => buildRoleDrafts(members))

  React.useEffect(() => {
    setMemberRecords(members)
  }, [members])

  React.useEffect(() => {
    setInvitationRecords(invitations)
  }, [invitations])

  React.useEffect(() => {
    setRoleDrafts(buildRoleDrafts(memberRecords))
  }, [memberRecords])

  const handleInvite = React.useCallback(() => {
    setFeedback(null)

    const parsed = inviteMemberSchema.safeParse({
      email: inviteEmail,
      role: inviteRole,
    })

    if (!parsed.success) {
      setFeedback({
        tone: "error",
        message: t("messages.invalidInvite"),
      })
      return
    }

    const normalizedEmail = parsed.data.email.toLowerCase()
    const memberExists = memberRecords.some(
      (member) => member.email.toLowerCase() === normalizedEmail
    )
    const pendingInviteExists = invitationRecords.some(
      (invitation) =>
        invitation.email.toLowerCase() === normalizedEmail &&
        invitation.status === "pending"
    )

    if (memberExists || pendingInviteExists) {
      setFeedback({
        tone: "error",
        message: "That email already has access or an active invitation.",
      })
      return
    }

    startInviteTransition(async () => {
      await waitForUi(180)

      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)

      setInvitationRecords((current) => [
        {
          createdAt: createdAt.toISOString(),
          email: normalizedEmail,
          expiresAt: expiresAt.toISOString(),
          id: `invite_${crypto.randomUUID()}`,
          invitedBy: currentUserId,
          role: parsed.data.role,
          status: "pending",
        },
        ...current,
      ])
      setInviteEmail("")
      setInviteRole("viewer")
      setFeedback({
        tone: "success",
        message: t("messages.inviteSent"),
      })
    })
  }, [currentUserId, invitationRecords, inviteEmail, inviteRole, memberRecords, t])

  const handleRoleChange = React.useCallback(
    async (member: SettingsMemberRecord) => {
      const nextRole = roleDrafts[member.userId]

      if (
        !nextRole ||
        nextRole === member.role ||
        !canEditNonOwnerMember(role, member.role)
      ) {
        return
      }

      setFeedback(null)
      setPendingMemberAction(member.userId)

      try {
        await waitForUi(150)

        setMemberRecords((current) =>
          current.map((record) =>
            record.userId === member.userId ? { ...record, role: nextRole } : record
          )
        )
        setFeedback({
          tone: "success",
          message: t("messages.updateSuccess"),
        })
      } catch (error) {
        setFeedback({
          tone: "error",
          message:
            error instanceof Error ? error.message : t("messages.updateFailed"),
        })
      } finally {
        setPendingMemberAction(null)
      }
    },
    [role, roleDrafts, t]
  )

  const handleRemoveMember = React.useCallback(
    async (member: SettingsMemberRecord) => {
      if (!canEditNonOwnerMember(role, member.role)) {
        return
      }

      if (
        !window.confirm(
          t("messages.removeConfirm", {
            email: member.email,
            organization: organizationName,
          })
        )
      ) {
        return
      }

      setFeedback(null)
      setPendingMemberAction(member.userId)

      try {
        await waitForUi(150)

        setMemberRecords((current) =>
          current.filter((record) => record.userId !== member.userId)
        )
        setRoleDrafts((current) => {
          const next = { ...current }
          delete next[member.userId]
          return next
        })
        setFeedback({
          tone: "success",
          message: t("messages.removeSuccess"),
        })
      } catch (error) {
        setFeedback({
          tone: "error",
          message:
            error instanceof Error ? error.message : t("messages.removeFailed"),
        })
      } finally {
        setPendingMemberAction(null)
      }
    },
    [organizationName, role, t]
  )

  const handleRevokeInvitation = React.useCallback(
    async (invitation: SettingsInvitationRecord) => {
      if (
        !window.confirm(
          t("messages.revokeConfirm", { email: invitation.email })
        )
      ) {
        return
      }

      setFeedback(null)
      setPendingInvitationAction(invitation.id)

      try {
        await waitForUi(120)

        setInvitationRecords((current) =>
          current.map((record) =>
            record.id === invitation.id
              ? { ...record, status: "revoked" as const }
              : record
          )
        )
        setFeedback({
          tone: "success",
          message: t("messages.revokeSuccess"),
        })
      } catch (error) {
        setFeedback({
          tone: "error",
          message:
            error instanceof Error ? error.message : t("messages.revokeFailed"),
        })
      } finally {
        setPendingInvitationAction(null)
      }
    },
    [t]
  )

  return (
    <DashboardPage
      title={t("page.title")}
      description={t("page.description")}
      actions={
        <Badge variant="outline">
          {t("accessBadge", { role: formatRole(role) })}
        </Badge>
      }
    >
      <SettingsSectionNav />

      {!canManageMembers ? (
        <Alert>
          <ShieldCheck />
          <AlertTitle>{t("alerts.readOnlyTitle")}</AlertTitle>
          <AlertDescription>
            {t("alerts.readOnlyDescription", {
              organization: organizationName,
            })}
          </AlertDescription>
        </Alert>
      ) : null}

      {feedback ? (
        <Alert variant={feedback.tone === "error" ? "destructive" : "default"}>
          {feedback.tone === "error" ? <AlertTriangle /> : <CheckCircle2 />}
          <AlertTitle>
            {feedback.tone === "error"
              ? t("alerts.actionFailed")
              : t("alerts.actionCompleted")}
          </AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      {canManageMembers ? (
        <PageSection
          title={t("sections.inviteTitle")}
          description={t("sections.inviteDescription")}
        >
          <SectionCard
            title={t("sections.sendInvitationTitle")}
            description={t("sections.sendInvitationDescription")}
          >
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(180px,0.6fr)_auto] md:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="invite-email">
                  {t("fields.emailAddress")}
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="teammate@registry.studio"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  disabled={isInviting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="invite-role">
                  {t("fields.role")}
                </label>
                <Select
                  value={inviteRole}
                  onValueChange={(value) =>
                    setInviteRole(value as InvitationRole)
                  }
                  disabled={isInviting}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {invitationRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {formatRole(option.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} disabled={isInviting}>
                {isInviting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <MailPlus />
                )}
                {isInviting ? t("actions.sending") : t("actions.sendInvite")}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("messages.inviteHint")}
            </p>
          </SectionCard>
        </PageSection>
      ) : null}

      <PageSection
        title={t("sections.currentMembersTitle")}
        description={t("sections.currentMembersDescription")}
      >
        <SectionCard
          title={t("sections.orgAccessTitle")}
          description={t("sections.orgAccessDescription")}
        >
          {memberRecords.length > 0 ? (
            <div className="divide-y">
              {memberRecords.map((member) => {
                const canEdit =
                  canEditNonOwnerMember(role, member.role) &&
                  member.userId !== currentUserId
                const draftRole =
                  roleDrafts[member.userId] ?? (member.role as InvitationRole)
                const hasRoleChange =
                  member.role !== "owner" && draftRole !== member.role

                return (
                  <div
                    key={member.userId}
                    className="grid gap-4 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1.3fr)_180px_auto]"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {member.fullName ?? member.email}
                        </p>
                        {member.userId === currentUserId ? (
                          <Badge variant="secondary">{sharedT("you")}</Badge>
                        ) : null}
                        <Badge variant="outline">
                          {formatRole(member.role)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("messages.joined", {
                          date: dateFormatter.format(new Date(member.joinedAt)),
                        })}
                      </p>
                    </div>

                    {member.role === "owner" ? (
                      <div className="text-sm text-muted-foreground">
                        {t("messages.ownerLocked")}
                      </div>
                    ) : (
                      <Select
                        value={draftRole}
                        onValueChange={(value) =>
                          setRoleDrafts((current) => ({
                            ...current,
                            [member.userId]: value as InvitationRole,
                          }))
                        }
                        disabled={
                          !canEdit || pendingMemberAction === member.userId
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {invitationRoleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {formatRole(option.value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {member.role !== "owner" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleRoleChange(member)}
                          disabled={
                            !canEdit ||
                            !hasRoleChange ||
                            pendingMemberAction === member.userId
                          }
                        >
                          {pendingMemberAction === member.userId ? (
                            <LoaderCircle className="animate-spin" />
                          ) : null}
                          {t("actions.updateRole")}
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleRemoveMember(member)}
                        disabled={
                          !canEdit || pendingMemberAction === member.userId
                        }
                      >
                        <UserMinus />
                        {t("actions.remove")}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title={t("messages.noMembersTitle")}
              description={t("messages.noMembersDescription")}
            />
          )}
        </SectionCard>
      </PageSection>

      {canManageMembers ? (
        <PageSection
          title={t("sections.pendingInvitesTitle")}
          description={t("sections.pendingInvitesDescription")}
        >
          <SectionCard
            title={t("sections.invitationQueueTitle")}
            description={t("sections.invitationQueueDescription")}
          >
            {invitationRecords.length > 0 ? (
              <div className="divide-y">
                {invitationRecords.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="grid gap-4 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1.2fr)_160px_160px_auto]"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("messages.invited", {
                          date: dateFormatter.format(
                            new Date(invitation.createdAt)
                          ),
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {formatRole(invitation.role)}
                    </Badge>
                    <Badge
                      variant={
                        invitation.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                      className="w-fit"
                    >
                      {formatInvitationState(invitation.status)}
                    </Badge>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <p className="text-sm text-muted-foreground">
                        {t("messages.expires", {
                          date: dateFormatter.format(
                            new Date(invitation.expiresAt)
                          ),
                        })}
                      </p>
                      {invitation.status === "pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            void handleRevokeInvitation(invitation)
                          }
                          disabled={pendingInvitationAction === invitation.id}
                        >
                          {pendingInvitationAction === invitation.id ? (
                            <LoaderCircle className="animate-spin" />
                          ) : null}
                          {t("actions.revoke")}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t("messages.noInvitesTitle")}
                description={t("messages.noInvitesDescription")}
              />
            )}
          </SectionCard>
        </PageSection>
      ) : null}
    </DashboardPage>
  )
}
