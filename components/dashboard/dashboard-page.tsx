import { cn } from "@/lib/utils"
import {
  PageHeader,
  type PageHeaderProps,
} from "@/components/dashboard/page-header"

export interface DashboardPageProps extends PageHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DashboardPage({
  title,
  description,
  actions,
  children,
  className,
}: DashboardPageProps) {
  return (
    <div className={cn("dashboard-motion-enter flex flex-col gap-5", className)}>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  )
}
