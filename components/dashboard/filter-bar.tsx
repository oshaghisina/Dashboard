export interface FilterBarProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function FilterBar({ children, actions }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-accent/40 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
