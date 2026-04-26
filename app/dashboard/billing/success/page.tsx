import { BillingSuccessPage } from "@/features/billing/success-page"

export default async function DashboardBillingSuccessRoute({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: string; plan?: string }>
}) {
  const params = await searchParams

  return (
    <BillingSuccessPage cycle={params.cycle ?? "monthly"} planId={params.plan ?? "pro"} />
  )
}
