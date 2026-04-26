import { WalletPage } from "@/features/wallet/wallet-page"

export default async function DashboardBillingWalletRoute({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const params = await searchParams

  return <WalletPage state={params.state} />
}
