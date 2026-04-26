import { TicketDetailPage } from "@/features/tickets/ticket-detail-page"
import { parseTicketDetailDemoState } from "@/features/tickets/ticket-presenters"

export default async function TicketDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ state?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])

  return (
    <TicketDetailPage
      ticketId={id}
      demoState={parseTicketDetailDemoState(query.state)}
    />
  )
}
