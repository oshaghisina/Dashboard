import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-2.5 border-b pb-4">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            {title}
          </h1>
          {description ? (
            <p className="text-sm leading-5.5 text-muted-foreground sm:text-[0.95rem]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 lg:justify-end",
              "[&_[data-slot=button]]:shadow-none"
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}
