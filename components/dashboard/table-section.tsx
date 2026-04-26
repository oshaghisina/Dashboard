import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/dashboard/data-table"
import {
  PageSection,
  type PageSectionProps,
} from "@/components/dashboard/page-section"

interface TableSectionProps<TData, TValue>
  extends Pick<
    PageSectionProps,
    "title" | "description" | "actions" | "className"
  > {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterBar?: React.ReactNode
  emptyState?: React.ReactNode
  pageSize?: number
}

export function TableSection<TData, TValue>({
  title,
  description,
  actions,
  className,
  columns,
  data,
  filterBar,
  emptyState,
  pageSize,
}: TableSectionProps<TData, TValue>) {
  return (
    <PageSection
      title={title}
      description={description}
      actions={actions}
      className={className}
    >
      {filterBar}
      <DataTable
        columns={columns}
        data={data}
        emptyState={emptyState}
        pageSize={pageSize}
      />
    </PageSection>
  )
}
