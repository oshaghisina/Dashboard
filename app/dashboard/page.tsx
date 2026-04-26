import {
  DashboardOverviewPage,
} from "@/features/dashboard/overview-page"

function parseOverviewDemoState(value: string | undefined) {
  switch (value) {
    case "loading":
    case "error":
    case "expiring":
    case "expired":
    case "no-plan":
    case "high-usage":
    case "critical-usage":
    case "unlimited":
    case "empty-activity":
      return value
    default:
      return "default"
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const params = await searchParams

  return <DashboardOverviewPage demoState={parseOverviewDemoState(params.state)} />
}
