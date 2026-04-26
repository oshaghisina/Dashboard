"use client"

import Link from "next/link"

import { planOptions } from "@/lib/mock-data/vpn"
import { useLocaleContext } from "@/components/providers/locale-provider"
import { formatCurrency } from "@/lib/formatting"
import { localizePathname } from "@/lib/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { PageSection } from "@/components/dashboard/page-section"
import { SectionCard } from "@/components/dashboard/section-card"

export function PlansPage() {
  const { locale } = useLocaleContext()

  return (
    <DashboardPage
      title={locale === "fa" ? "انتخاب پلن" : "Choose a plan"}
      description={
        locale === "fa"
          ? "پلن مناسب را انتخاب کنید و وارد مرحله پرداخت شوید."
          : "Pick the plan that fits your bandwidth and device needs."
      }
    >
      <PageSection>
        <div className="grid gap-4 xl:grid-cols-3">
          {planOptions.map((plan) => (
            <SectionCard
              key={plan.id}
              title={plan.name}
              description={`${plan.dataAllowance} · ${plan.deviceLimit}`}
              actions={plan.popular ? <Badge>{locale === "fa" ? "محبوب" : "Popular"}</Badge> : null}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-black">{formatCurrency(plan.monthlyPrice, locale)}</p>
                  <p className="text-sm text-muted-foreground">
                    {locale === "fa" ? "ماهانه" : "per month"}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>{plan.dataAllowance}</li>
                  <li>{plan.configLimit}</li>
                  <li>{plan.deviceLimit}</li>
                  <li>{plan.supportLabel}</li>
                </ul>
                <Button asChild className="w-full">
                  <Link href={localizePathname(`/dashboard/billing/checkout?plan=${plan.id}&cycle=monthly`, locale)}>
                    {locale === "fa" ? "انتخاب پلن" : `Get ${plan.name}`}
                  </Link>
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      </PageSection>
    </DashboardPage>
  )
}
