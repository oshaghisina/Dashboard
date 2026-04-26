"use client"

import {
  getAdoptionCompareOptions,
  getAdoptionRangeOptions,
  type AdoptionCompare,
  type AdoptionRange,
} from "@/features/adoption/adoption-overview-data"

import { useTranslations } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilterBar } from "@/components/dashboard/filter-bar"

export interface AdoptionOverviewFiltersProps {
  range: AdoptionRange
  compare: AdoptionCompare
  isRefreshing?: boolean
  onRangeChange: (value: AdoptionRange) => void
  onCompareChange: (value: AdoptionCompare) => void
}

export function AdoptionOverviewFilters({
  range,
  compare,
  isRefreshing = false,
  onRangeChange,
  onCompareChange,
}: AdoptionOverviewFiltersProps) {
  const t = useTranslations("dashboardContent.adoption")
  const rangeOptions = getAdoptionRangeOptions((key) => t(key))
  const compareOptions = getAdoptionCompareOptions((key) => t(key))

  return (
    <FilterBar
      actions={
        <>
          <Badge variant="outline">
            {isRefreshing
              ? t("filters.refreshingReport")
              : t("filters.liveWorkspaceSnapshot")}
          </Badge>
          <p className="hidden text-sm text-muted-foreground lg:block">
            {t("filters.helper")}
          </p>
        </>
      }
    >
      <Select
        value={range}
        onValueChange={(value) => onRangeChange(value as AdoptionRange)}
        disabled={isRefreshing}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("filters.selectRange")} />
        </SelectTrigger>
        <SelectContent align="start">
          {rangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={compare}
        onValueChange={(value) => onCompareChange(value as AdoptionCompare)}
        disabled={isRefreshing}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t("filters.compareAgainst")} />
        </SelectTrigger>
        <SelectContent align="start">
          {compareOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  )
}
