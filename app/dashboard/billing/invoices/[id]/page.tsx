import { InvoiceDetailPage } from "@/features/billing/invoice-detail-page"

export default async function DashboardInvoiceDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <InvoiceDetailPage invoiceId={id} />
}
