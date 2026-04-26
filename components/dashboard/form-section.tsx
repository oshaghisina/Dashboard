import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function FormSection({
  title,
  description,
  children,
  footer,
}: FormSectionProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-5 px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">{footer}</CardFooter>
      ) : null}
    </Card>
  )
}
