import { CheckoutPage } from "@/features/billing/checkout-page"

export default async function DashboardBillingCheckoutRoute({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: "monthly" | "quarterly" | "yearly"; plan?: string }>
}) {
  const params = await searchParams

  return (
    <CheckoutPage
      initialCycle={params.cycle ?? "monthly"}
      initialPlanId={params.plan ?? "pro"}
    />
  )
}
