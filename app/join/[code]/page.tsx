import { JoinPage } from "@/features/auth/join-page"

export default async function JoinRoute({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <JoinPage code={code} />
}
