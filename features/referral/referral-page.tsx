"use client"

import { CheckCircle2, Copy, Mail, Send, Share2 } from "lucide-react"

import { referralHistory, referralSummary } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { useUiState } from "@/components/providers/ui-provider"
import { formatCurrency, formatDate } from "@/lib/formatting"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"
import { StatCard } from "@/components/dashboard/stat-card"

export function ReferralPage() {
  const { locale } = useLocaleContext()
  const { addToast } = useUiState()

  return (
    <DashboardPage
      title={locale === "fa" ? "دعوت دوستان" : "Referral program"}
      description={
        locale === "fa"
          ? "کد دعوت، لینک اشتراک‌گذاری و آمار پاداش خود را ببینید."
          : "View your referral code, share links, and reward performance."
      }
    >
      <PageSection>
        <SectionCard
          title={locale === "fa" ? "کد دعوت شما" : "Your referral code"}
          description={referralSummary.referralLink}
        >
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border bg-muted/20 p-4 text-center" dir="ltr">
              <p className="text-3xl font-black tracking-[0.32em]">{referralSummary.code}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void navigator.clipboard.writeText(referralSummary.code).then(() => {
                    addToast(locale === "fa" ? "کد دعوت کپی شد." : "Referral code copied.", "success")
                  })
                }
              >
                <Copy className="size-4" />
                {locale === "fa" ? "کپی کد" : "Copy code"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void navigator.clipboard.writeText(referralSummary.referralLink).then(() => {
                    addToast(locale === "fa" ? "لینک دعوت کپی شد." : "Referral link copied.", "success")
                  })
                }
              >
                <Share2 className="size-4" />
                {locale === "fa" ? "کپی لینک" : "Copy link"}
              </Button>
              <Button type="button" variant="outline">
                <Send className="size-4" />
                Telegram
              </Button>
              <Button type="button" variant="outline">
                <Mail className="size-4" />
                Email
              </Button>
            </div>
          </div>
        </SectionCard>
      </PageSection>

      <PageSection>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label={locale === "fa" ? "ثبت‌نام‌ها" : "Referred"}
            value={String(referralSummary.referredCount)}
            trend={locale === "fa" ? "ثبت‌نام" : "signups"}
          />
          <StatCard
            label={locale === "fa" ? "تبدیل شده" : "Converted"}
            value={String(referralSummary.convertedCount)}
            trend={locale === "fa" ? "خرید موفق" : "paid plans"}
          />
          <StatCard
            label={locale === "fa" ? "درآمد" : "Earned"}
            value={formatCurrency(referralSummary.earnedAmount, locale)}
            trend={locale === "fa" ? "پاداش" : "credits"}
          />
        </div>
      </PageSection>

      <PageSection
        title={locale === "fa" ? "تاریخچه دعوت‌ها" : "Referral history"}
      >
        <SectionCard>
          <div className="space-y-3">
            {referralHistory.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-xl border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium">{item.emailMasked}</p>
                  <p className="text-muted-foreground">{formatDate(item.date, locale)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.status === "paid" ? "secondary" : "outline"}>
                    {item.status === "paid"
                      ? locale === "fa"
                        ? "پرداخت"
                        : "Paid"
                      : item.status === "signed_up"
                        ? locale === "fa"
                          ? "ثبت‌نام"
                          : "Signed up"
                        : locale === "fa"
                          ? "در انتظار"
                          : "Pending"}
                  </Badge>
                  <span className="text-muted-foreground">{item.rewardLabel}</span>
                  {item.status === "paid" ? <CheckCircle2 className="size-4 text-primary" /> : null}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageSection>
    </DashboardPage>
  )
}
