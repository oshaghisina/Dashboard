import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface ChartCardProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  emptyState?: React.ReactNode
  hasData?: boolean
  className?: string
  contentClassName?: string
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  footer,
  emptyState,
  hasData = true,
  className,
  contentClassName,
}: ChartCardProps) {
  return (
    <Card className={cn("gap-0", className)}>
      {title || description || actions ? (
        <CardHeader className="border-b pb-6">
          <div className="space-y-1">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {actions ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn("pt-6", contentClassName)}>
        {hasData ? children : emptyState}
      </CardContent>
      {footer ? (
        <CardFooter className="border-t pt-6">{footer}</CardFooter>
      ) : null}
    </Card>
  )
}
