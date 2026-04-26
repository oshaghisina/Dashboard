import { VerifyEmailPage } from "@/features/auth/verify-email-page"

export default async function VerifyEmailRoute({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = await searchParams
  return <VerifyEmailPage email={params.email} />
}
