import { UserDetailPage } from "@/features/representatives/user-detail-page"

export default async function DashboardRepresentativeUserDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ assign?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])

  return <UserDetailPage userId={id} assignOpen={query.assign === "1"} />
}
