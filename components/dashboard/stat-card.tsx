import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface StatCardProps {
  label: string
  value: string
  trend?: string
  meta?: string
  icon?: React.ReactNode
}

export function StatCard({ label, value, trend, meta, icon }: StatCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {value}
            </CardTitle>
          </div>
          {icon ? (
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </div>
          ) : null}
        </div>
      </CardHeader>
      {trend || meta ? (
        <CardContent className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-foreground">{trend}</span>
          {meta ? <span className="text-muted-foreground">{meta}</span> : null}
        </CardContent>
      ) : null}
    </Card>
  )
}
