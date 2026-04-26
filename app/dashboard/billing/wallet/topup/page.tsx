import { WalletTopUpPage } from "@/features/wallet/wallet-topup-page"

export default async function DashboardBillingWalletTopUpRoute({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const params = await searchParams

  return <WalletTopUpPage returnTo={params.returnTo} />
}
