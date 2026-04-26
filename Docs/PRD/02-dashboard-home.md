# 02 — Dashboard Home

## Purpose

The first screen after login. Give users an instant health-check of their VPN subscription — expiry, usage, active connections — and surface the most common next actions without requiring navigation.

---

## Screen Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ SIDEBAR          │  MAIN CONTENT                                  │
│                  │                                                │
│ [Logo]           │  Good morning, Sina           [↑ Upgrade]     │
│                  │  ─────────────────────────────────────────     │
│ ● Overview       │                                                │
│   Configs        │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   Usage          │  │ Status   │ │  Usage   │ │ Expires  │      │
│   Billing        │  │ ● Active │ │ 42 GB /  │ │ 18 days  │      │
│   Referral       │  │          │ │ 100 GB   │ │          │      │
│   Settings       │  │          │ │          │ │          │      │
│                  │  │          │ │ ▓▓▓▓░░░░ │ │ Apr 29   │      │
│ ─────────────    │  └──────────┘ └──────────┘ └──────────┘      │
│ [Avatar]         │                                                │
│ Sina Oshaghi     │  Quick Actions                                 │
│ Pro Plan         │  [Get Config]  [View Usage]  [Renew Plan]      │
│                  │                                                │
│                  │  Recent Activity                               │
│                  │  ┌────────────────────────────────────────┐   │
│                  │  │  Today, 09:14   Connected · Frankfurt   │   │
│                  │  │  Yesterday      Connected · Amsterdam   │   │
│                  │  │  Apr 8          Connected · Frankfurt   │   │
│                  │  │              [View all →]               │   │
│                  │  └────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Components

### 2.1 Stat Cards (top row)

Three cards in a responsive grid (`grid-cols-1 sm:grid-cols-3`):

#### Status Card
- **Active** — green dot + "Active" label
- **Expiring Soon** (≤7 days) — amber dot + "Expiring in X days"
- **Expired** — red dot + "Expired" + [Renew Now] inline CTA
- **No Plan** — muted + "No active plan" + [Get Started] CTA

#### Usage Card
- Horizontal progress bar, color transitions: green → amber (>80%) → red (>95%)
- Label: `{used} GB / {total} GB`
- Sub-label: `{remaining} GB remaining`
- If unlimited plan: hide progress bar, show "Unlimited" badge

#### Expiry Card
- Days remaining, large number
- Human-readable date below: `Expires Apr 29, 2026`
- If expired: shows "Expired X days ago" in red
- If no plan: shows "--"

---

### 2.2 Quick Actions

Three ghost buttons below stat cards:

| Button | Destination | Shown When |
|--------|------------|------------|
| Get Config | `/dashboard/configs` | Always |
| View Usage | `/dashboard/usage` | Always |
| Renew Plan | `/dashboard/billing/plans` | Subscription active or expired |
| Upgrade Plan | `/dashboard/billing/plans` | On lower-tier plan |

---

### 2.3 Recent Activity Feed

- Shows last 5 connection events
- Columns: Date/time · Event type · Server location
- "View all →" links to `/dashboard/usage` with activity tab active
- Empty state: "No recent activity" with subtle illustration

---

### 2.4 Expiry Warning Banner

Appears **above** stat cards when expiry ≤ 7 days. Dismissible per session.

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠  Your plan expires in 5 days.  [Renew Now →]              ✕  │
└─────────────────────────────────────────────────────────────────┘
```

Color: amber background (`bg-amber-50`, `border-amber-200`), dark amber text.
Escalates to red when ≤ 1 day.

---

### 2.5 No-Plan State (new user)

Replaces stat cards + activity feed with a single centered onboarding card:

```
┌────────────────────────────────────────┐
│         [Shield icon, large]           │
│                                        │
│  You don't have an active plan yet.    │
│  Get started by choosing a plan.       │
│                                        │
│  [   Browse Plans   ]                  │
└────────────────────────────────────────┘
```

---

## States Summary

| Scenario | UI Response |
|----------|-------------|
| Loading | Skeleton cards (not spinner) to avoid layout shift |
| Active plan | Normal layout |
| Expiring ≤ 7 days | Amber banner + amber card border on Expiry card |
| Expired | Red status dot + red Expiry card + inline Renew CTA |
| No plan | Full onboarding empty state |
| Usage ≥ 95% | Red progress bar + inline "Upgrade" link |
| Data error | Error card with retry button in place of stat cards |

---

## Sidebar Navigation

```
┌──────────────────┐
│  [Logo]          │
├──────────────────┤
│  Overview        │
│  Configs         │
│  Usage           │
│  Billing         │
│  Wallet          │
│  Referral        │
│  Representatives │  ← visible only when role = "representative"
├──────────────────┤
│  Settings        │
├──────────────────┤
│  [Avatar]        │
│  Name            │
│  Plan badge      │
│  ─────────       │
│  Profile         │
│  Sign out        │
└──────────────────┘
```

- Active item: filled background, full-width
- Plan badge in sidebar footer: `Free` (muted) / `Pro` (blue) / `VIP` (gold)
- Sidebar collapses to icon-only mode at `md` breakpoint; full menu on `lg+`
- **Wallet** is part of Billing — links to `/dashboard/billing/wallet` from the Billing hub, not as a standalone sidebar item.
- **Representatives** is conditionally rendered: only visible when `currentUser.role === "representative"` — links to `/dashboard/representatives`; hidden entirely for standard users (not greyed out, not shown)

---

## Mobile Layout

```
┌──────────────────────────┐
│ [≡]   Tunnel      [🔔]   │
├──────────────────────────┤
│  ● Active                │
│  18 days · 42/100 GB     │
│  [Get Config]            │
├──────────────────────────┤
│  Usage this month        │
│  ▓▓▓▓░░░░ 42%            │
├──────────────────────────┤
│  Recent Activity         │
│  09:14 · Frankfurt       │
│  Yesterday · Amsterdam   │
├──────────────────────────┤
│ [Home][Configs][Usage][⋯]│
└──────────────────────────┘
```

- Bottom tab bar on mobile replaces sidebar
- Stat cards stack vertically
- Activity feed truncated to 3 items

---

## Responsive Breakpoints & Mobile Detail

### Breakpoint Table

| Breakpoint | Nav | Layout | Stat Cards |
|------------|-----|--------|------------|
| `< 640px` | Bottom tab bar | Single column | Stacked vertically |
| `640–1023px` | Icon-only sidebar (64px) | Single column | 2-column grid |
| `1024–1279px` | Full sidebar (220px) | 2-column content | 3-column grid |
| `≥ 1280px` | Full sidebar (240px) | 3-column content | 3-column grid |

---

### Bottom Tab Bar

```
┌──────────────────────────────────┐
│ [🏠 Home][⚡Configs][📊Usage][⋯] │
│   ●                               │  ← active indicator dot
└──────────────────────────────────┘
```

| Tab | Icon | Label | Route |
|-----|------|-------|-------|
| Home | `Home` | Home | `/dashboard` |
| Configs | `Shield` | Configs | `/dashboard/configs` |
| Usage | `Activity` | Usage | `/dashboard/usage` |
| More | `MoreHorizontal` | More | Bottom sheet |

- Active tab: brand color icon + label + dot indicator above
- Badge on Configs when plan is expiring soon
- Tab labels hidden at `< 360px` — icons only

**"More" bottom sheet:**
```
┌────────────────────────┐
│  ────                  │  ← drag handle
│  [💳]  Billing         │
│  [💰]  Wallet          │
│  [👥]  Representatives │  ← only when role = "representative"
│  [⚙]  Settings        │
│  [👤]  Profile         │
│  [→]   Sign out        │
└────────────────────────┘
```

---

### Summary Row (Mobile — Compact View)

The three desktop stat cards collapse into one combined row on mobile:

```
┌──────────────────────────────┐
│ ● Active   42/100 GB  18 days │
│ [░░▓▓▓▓▓▓▓░░] 42%            │
│ [Get Config →]                │
└──────────────────────────────┘
```

Tapping the row expands to show all three cards in full detail (accordion).

---

### Expiry Warning Banner — Mobile

Banner text truncates; full message on tap/expand:

```
┌──────────────────────────────┐
│ ⚠  Expiring in 5 days [Renew]│
└──────────────────────────────┘
```

---

### Landscape Orientation

On landscape (`height < 500px`):
- Top bar collapses (logo hidden)
- Stat cards use 3-column horizontal grid
- Activity feed scrolls inline (no full-height takeover)
- Bottom nav persists (fixed, `48px` tall)

---

### Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Pull-to-refresh | Refreshes stat cards + activity feed |
| Long-press stat card | Tooltip: last-updated timestamp |
| Tap activity row | Opens session detail bottom sheet |
| Swipe "More" sheet down | Dismisses sheet |

---

## نمای فارسی — Screen Layout (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`) — ستون کناری به راست منتقل می‌شود، محتوا به چپ

### دسکتاپ

```
┌──────────────────────────────────────────────────────────────────┐
│              محتوای اصلی               │         منوی کناری      │
│                                        │                         │
│    [ارتقا ↑]           صبح بخیر، سینا  │          [لوگو]         │
│    ─────────────────────────────────── │                         │
│                                        │  خلاصه ●                │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │    کانفیگ‌ها             │
│  │  انقضا  │ │  مصرف   │ │  وضعیت │ │    مصرف                 │
│  │ ۱۸ روز  │ │  ۴۲ گیگ │ │ ● فعال │ │    صورتحساب             │
│  │         │ │ ۱۰۰ گیگ │ │        │ │    تنظیمات              │
│  │ ۲۹ فرو  │ │ ░░▓▓▓▓▓ │ │        │ │                         │
│  └──────────┘ └──────────┘ └─────────┘ │  ─────────────          │
│                                        │  [آواتار]               │
│              اقدام‌های سریع             │  سینا اشاقی             │
│    [تمدید پلن]  [مشاهده مصرف]  [دریافت کانفیگ]  │  پلن حرفه‌ای     │
│                                        │                         │
│              فعالیت اخیر               │                         │
│  ┌──────────────────────────────────┐  │                         │
│  │   فرانکفورت · متصل   ۰۹:۱۴ امروز│  │                         │
│  │  آمستردام · متصل   دیروز        │  │                         │
│  │  فرانکفورت · متصل   ۸ فروردین   │  │                         │
│  │           [← مشاهده همه]        │  │                         │
│  └──────────────────────────────────┘  │                         │
└──────────────────────────────────────────────────────────────────┘
```

### موبایل

```
┌──────────────────────────┐
│   [🔔]    تانل     [≡]   │
├──────────────────────────┤
│              ● فعال      │
│    ۴۲/۱۰۰ گیگ · ۱۸ روز  │
│        [دریافت کانفیگ]   │
├──────────────────────────┤
│          مصرف این ماه    │
│            ۴۲%  ░▓▓▓▓   │
├──────────────────────────┤
│           فعالیت اخیر    │
│   فرانکفورت · ۰۹:۱۴     │
│   آمستردام · دیروز       │
├──────────────────────────┤
│ [⋯][مصرف][کانفیگ][خانه] │
└──────────────────────────┘
```

### نوار ناوبری کناری (فارسی)

```
┌──────────────────┐
│          [لوگو]  │
├──────────────────┤
│          خلاصه   │
│       کانفیگ‌ها   │
│           مصرف   │
│      صورتحساب    │
│       کیف پول    │
│         معرفی    │  ← فقط برای نمایندگان
├──────────────────┤
│        تنظیمات   │
├──────────────────┤
│       [آواتار]   │
│       نام کاربر  │
│       نشان پلن   │
│       ─────────  │
│          پروفایل │
│    خروج از حساب  │
└──────────────────┘
```

### نوار هشدار (فارسی)

```
┌─────────────────────────────────────────────────────────────────┐
│ ✕  [تمدید کنید ←]  .پلن شما تا ۵ روز دیگر منقضی می‌شود  ⚠    │
└─────────────────────────────────────────────────────────────────┘
```

### حالت بدون پلن (فارسی)

```
┌────────────────────────────────────────┐
│         [آیکون سپر، بزرگ]             │
│                                        │
│       هنوز پلن فعالی ندارید.           │
│    با انتخاب یک پلن شروع کنید.        │
│                                        │
│         [   مشاهده پلن‌ها   ]          │
└────────────────────────────────────────┘
```

### نکات RTL برای داشبورد

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| ستون کناری | سمت راست صفحه |
| آیتم فعال منو | حاشیه پر در سمت راست (نه چپ) |
| نشان‌گر «مشاهده همه →» | جهت فلش: ← |
| نوار هشدار | دکمه بستن (✕) سمت چپ، آیکون هشدار سمت راست |
| تب بار موبایل | ترتیب آیتم‌ها از راست به چپ معکوس می‌شود |
| نوار پیشرفت | از راست پر می‌شود |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/page.tsx`
- `features/dashboard/overview-page.tsx`
- Feature-local overview data alongside the page component or in `mock-data/`

### Reuse Order

1. Build the page with `DashboardPage`.
2. Split sections with `PageSection`.
3. Use `StatCard` for the top summary row.
4. Use `SectionCard` or existing dashboard cards for activity and empty-state sections.

### Frontend-Only Rules

- Replace the current overview content with the VPN dashboard experience when this PRD is implemented.
- No live status polling or remote refresh is required.
- Expiry, usage, and activity data should come from local mock objects.
- Banners, loading states, and error states can be toggled via local demo data variants.

### Required View Model

- `status`: `active | expiringSoon | expired | noPlan`
- `usage.usedGb`
- `usage.totalGb`
- `usage.unlimited`
- `expiry.daysRemaining`
- `expiry.dateLabel`
- `recentActivity[]`
- `showExpiryBanner`
- `hasDataError`
- `currentUser.role`: `"user" | "representative"` — controls sidebar and More-sheet visibility of the Representatives item

### Done Criteria

- The page covers `loading`, `active`, `expiring`, `expired`, `no plan`, and `error` states.
- Summary cards, quick actions, and recent activity all work with mock data only.
- The mobile compact summary row and bottom navigation behavior are represented in the UI.

### In Scope Now

- Overview summary cards, warning banners, quick actions, recent activity, and no-plan state.
- Mobile compact summary row and desktop dashboard layout.

### Out Of Scope Now

- Real-time polling, server-driven banner orchestration, and persisted banner dismissal across sessions.

### Banner Priority

1. Expired plan
2. 100% quota exhausted
3. Expiring soon
4. 95% quota warning
5. Informational system message

Only the highest-priority banner should be visible in the first frontend pass.

### Sample Data

```ts
const dashboardOverviewDemo = {
	status: "expiringSoon",
	usage: { usedGb: 42, totalGb: 100, unlimited: false },
	expiry: { daysRemaining: 5, dateLabel: "Apr 29, 2026" },
	recentActivity: [
		{ id: "a1", timeLabel: "Today, 09:14", location: "Frankfurt", event: "Connected" },
		{ id: "a2", timeLabel: "Yesterday", location: "Amsterdam", event: "Connected" },
	],
	showExpiryBanner: true,
	hasDataError: false,
}
```
