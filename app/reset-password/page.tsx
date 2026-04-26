import { ResetPasswordPage } from "@/features/auth/reset-password-page"

export default async function ResetPasswordRoute({
  searchParams,
}: {
  searchParams: Promise<{ state?: "default" | "expired" | "used" | "success" }>
}) {
  const params = await searchParams
  return <ResetPasswordPage state={params.state} />
}
