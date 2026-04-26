"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useLocale, useTranslations } from "@/lib/i18n/client"
import { getLocaleDirection, type AppLocale } from "@/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/dashboard/empty-state"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  emptyState?: React.ReactNode
  pageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyState,
  pageSize = 8,
}: DataTableProps<TData, TValue>) {
  const locale = useLocale() as AppLocale
  const direction = getLocaleDirection(locale)
  const t = useTranslations()
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const defaultEmptyState = (
    <EmptyState
      title={t("inventory.empty.noStockTitle")}
      description={t("inventory.empty.noStockDescription")}
    />
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  {emptyState ?? defaultEmptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t("common.pagination.showingRows", {
              total: data.length,
              visible: rows.length,
            })}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
              <span className="sr-only">
                {t("common.pagination.previousPage")}
              </span>
            </Button>
            <span className="min-w-24 text-center text-sm text-muted-foreground">
              {t("common.pagination.pageOf", {
                page: table.getState().pagination.pageIndex + 1,
                total: Math.max(table.getPageCount(), 1),
              })}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
              <span className="sr-only">{t("common.pagination.nextPage")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
