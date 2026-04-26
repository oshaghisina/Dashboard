import { TicketsPage } from "@/features/tickets/tickets-page"
import { parseTicketsListDemoState } from "@/features/tickets/ticket-presenters"

export default async function TicketsRoute({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const params = await searchParams

  return <TicketsPage demoState={parseTicketsListDemoState(params.state)} />
}
