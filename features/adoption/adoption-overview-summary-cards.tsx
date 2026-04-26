import { type AdoptionOverviewDataset } from "@/features/adoption/adoption-overview-data"

import { StatCard } from "@/components/dashboard/stat-card"

export interface AdoptionOverviewSummaryCardsProps {
  dataset: AdoptionOverviewDataset
}

export function AdoptionOverviewSummaryCards({
  dataset,
}: AdoptionOverviewSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dataset.metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
          meta={metric.meta}
          icon={metric.icon}
        />
      ))}
    </div>
  )
}
