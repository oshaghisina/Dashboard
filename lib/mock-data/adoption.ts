import type {
  AdoptionCompare,
  AdoptionOverviewPayload,
  AdoptionRange,
} from "@/features/adoption/adoption-overview-data"

const payloads: Record<
  AdoptionRange,
  Record<AdoptionCompare, AdoptionOverviewPayload>
> = {
  "30d": {
    previous: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 48200,
          compareValue: 44100,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 18,
          compareValue: 16,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 96.4,
          compareValue: 94.8,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 17200,
          compareValue: 15150,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "Week 1", installs: 10800, previews: 3600 },
        { label: "Week 2", installs: 11600, previews: 3900 },
        { label: "Week 3", installs: 12300, previews: 4600 },
        { label: "Week 4", installs: 13500, previews: 5100 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 41 },
        { source: "Docs", usage: 31 },
        { source: "Create", usage: 18 },
        { source: "API", usage: 10 },
      ],
      insights: [
        {
          label: "Preview sessions accelerated",
          value: "+13.5%",
          delta: "Strong lift after the docs IA cleanup.",
          description:
            "Shared preview links are converting better for component review and product QA.",
        },
        {
          label: "Stable installs remain dominant",
          value: "63%",
          delta: "Down 2 points from the prior window.",
          description:
            "Canary usage is rising inside product teams, but stable remains the default release path.",
        },
        {
          label: "Publishing reliability improved",
          value: "96.4%",
          delta: "+1.6 pts over the previous window.",
          description:
            "Release failures are concentrated in two workspaces still pending review.",
        },
      ],
    },
    year: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 48200,
          compareValue: 36600,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 18,
          compareValue: 11,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 96.4,
          compareValue: 91.1,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 17200,
          compareValue: 9800,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "Jan", installs: 7600, previews: 2100 },
        { label: "Feb", installs: 8900, previews: 2600 },
        { label: "Mar", installs: 11100, previews: 3400 },
        { label: "Apr", installs: 20600, previews: 9100 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 38 },
        { source: "Docs", usage: 28 },
        { source: "Create", usage: 22 },
        { source: "API", usage: 12 },
      ],
      insights: [
        {
          label: "Install demand is up year over year",
          value: "+31.7%",
          delta: "Highest acceleration in product surfaces using mock-first workflows.",
          description:
            "The frontend-only extraction path is helping more teams adopt the dashboard UI without backend prerequisites.",
        },
        {
          label: "More workspaces are active",
          value: "+7",
          delta: "Broad-based growth across ops and care products.",
          description:
            "A larger slice of the organization now relies on the shared design system for production work.",
        },
      ],
    },
  },
  "90d": {
    previous: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 131000,
          compareValue: 118400,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 24,
          compareValue: 21,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 95.8,
          compareValue: 94.1,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 48100,
          compareValue: 42900,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "Month 1", installs: 39600, previews: 13800 },
        { label: "Month 2", installs: 42400, previews: 15100 },
        { label: "Month 3", installs: 49000, previews: 19200 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 43 },
        { source: "Docs", usage: 27 },
        { source: "Create", usage: 19 },
        { source: "API", usage: 11 },
      ],
      insights: [
        {
          label: "Adoption is still expanding",
          value: "+10.6%",
          delta: "Momentum is strongest in the latest month.",
          description:
            "Preview usage and install pulls are both rising as more teams standardize on the shared dashboard stack.",
        },
      ],
    },
    year: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 131000,
          compareValue: 97800,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 24,
          compareValue: 15,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 95.8,
          compareValue: 90.6,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 48100,
          compareValue: 26600,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "Q1", installs: 32800, previews: 9200 },
        { label: "Q2", installs: 38700, previews: 11800 },
        { label: "Q3", installs: 59500, previews: 27100 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 40 },
        { source: "Docs", usage: 26 },
        { source: "Create", usage: 21 },
        { source: "API", usage: 13 },
      ],
      insights: [
        {
          label: "Preview-first workflows are winning",
          value: "+80.8%",
          delta: "The strongest yearly lift is in shared previews.",
          description:
            "Teams are using the extracted UI shell to validate flows earlier, before backend integration begins.",
        },
      ],
    },
  },
  "12m": {
    previous: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 538000,
          compareValue: 489500,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 29,
          compareValue: 25,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 95.1,
          compareValue: 93.4,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 192000,
          compareValue: 174000,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "Q1", installs: 112000, previews: 38000 },
        { label: "Q2", installs: 126000, previews: 46000 },
        { label: "Q3", installs: 138000, previews: 51000 },
        { label: "Q4", installs: 162000, previews: 57000 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 39 },
        { source: "Docs", usage: 29 },
        { source: "Create", usage: 20 },
        { source: "API", usage: 12 },
      ],
      insights: [
        {
          label: "The dashboard shell is now a product baseline",
          value: "29 active workspaces",
          delta: "Four more than the prior yearly window.",
          description:
            "Most teams now treat the shared UI shell as a default starting point for internal tools.",
        },
      ],
    },
    year: {
      metrics: [
        {
          key: "install_pulls",
          label: "Install pulls",
          value: 538000,
          compareValue: 401000,
          meta: "CLI and docs installs",
        },
        {
          key: "active_workspaces",
          label: "Active workspaces",
          value: 29,
          compareValue: 17,
          meta: "Touched the registry this period",
        },
        {
          key: "publish_success",
          label: "Publish success",
          value: 95.1,
          compareValue: 89.7,
          meta: "Release and preview jobs",
        },
        {
          key: "preview_sessions",
          label: "Preview sessions",
          value: 192000,
          compareValue: 109000,
          meta: "Create studio and shared previews",
        },
      ],
      trendSeries: [
        { label: "2023", installs: 86000, previews: 24000 },
        { label: "2024", installs: 111000, previews: 36000 },
        { label: "2025", installs: 158000, previews: 53000 },
        { label: "2026", installs: 183000, previews: 79000 },
      ],
      channelSeries: [
        { source: "Dashboard", usage: 37 },
        { source: "Docs", usage: 28 },
        { source: "Create", usage: 23 },
        { source: "API", usage: 12 },
      ],
      insights: [
        {
          label: "Yearly adoption is materially stronger",
          value: "+34.2%",
          delta: "Install pull growth is broad, not concentrated.",
          description:
            "The frontend-only extraction path reduced setup time enough that more teams adopted the shared dashboard UI.",
        },
      ],
    },
  },
}

export const defaultAdoptionRange: AdoptionRange = "90d"
export const defaultAdoptionCompare: AdoptionCompare = "previous"

export function getMockAdoptionPayload(
  range: AdoptionRange,
  compare: AdoptionCompare
) {
  return payloads[range][compare]
}

