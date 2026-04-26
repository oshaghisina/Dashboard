# 05 — Usage & Status

## Purpose

Show users exactly how much bandwidth they've consumed, which devices are active, and their connection history — so they can manage their plan intelligently and detect unexpected activity.

---

## Route

`/dashboard/usage`

---

## Screen Layout (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Usage & Status                                                │
├────────────────────────────────────────────────────────────────┤
│  [This Month ▼]   Apr 1 – Apr 11, 2026                        │
│                                                                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│  │ Used          │ │ Remaining     │ │ Sessions      │        │
│  │ 42.3 GB       │ │ 57.7 GB       │ │ 28            │        │
│  │ of 100 GB     │ │               │ │ this month    │        │
│  └───────────────┘ └───────────────┘ └───────────────┘        │
│                                                                │
│  Bandwidth Usage                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Bar chart — daily usage, current month]               │  │
│  │                                                          │  │
│  │  Apr 1  Apr 3  Apr 5  Apr 7  Apr 9  Apr 11              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  [Usage]  [Sessions]  [Devices]              ← tab switcher    │
│  ─────────────────────────────────────────────────────────     │
│  Session History                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Apr 11  09:14  Frankfurt   ↑2.1GB ↓8.4GB  1h 23m  [✕] │  │
│  │  Apr 10  22:01  Amsterdam   ↑0.4GB ↓3.2GB  0h 45m      │  │
│  │  Apr 10  14:33  Frankfurt   ↑1.8GB ↓7.1GB  2h 10m      │  │
│  │                                    [Load more]           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 5.1 Summary Stat Cards

Three cards in a responsive grid:

| Card | Metric | Notes |
|------|--------|-------|
| Used | GB consumed this period | Color: green → amber (>80%) → red (>95%) |
| Remaining | GB left | Hides on unlimited plan, shows "Unlimited" badge |
| Sessions | Count of connections | Number of times user connected |

---

## 5.2 Bandwidth Chart

**Chart type:** Vertical bar chart (one bar per day)

- X-axis: days of the current period
- Y-axis: GB (auto-scaled)
- Hover tooltip: date + exact GB value + session count for that day
- Color: primary blue, amber when daily usage is unusually high (>2× average)
- No data for future days (bars simply absent)
- Period selector above chart:
  - This Month (default)
  - Last Month
  - Last 3 Months (line chart for this range)
  - Custom Range (date picker, max 90 days)

---

## 5.3 Tab: Usage (Breakdown)

Shows a secondary breakdown below the chart:

```
┌────────────────────────────────────────────────────────┐
│  Upload        ↑ 12.4 GB   ████░░░░░░  24%            │
│  Download      ↓ 29.9 GB   ████████░░  71%            │
│  Other/Overhead  2.1 GB    ██░░░░░░░░   5%            │
└────────────────────────────────────────────────────────┘
```

Also: percentage of plan used, estimated days until quota depletes (based on daily average).

---

## 5.4 Tab: Sessions

Session history list. Each row:

| Column | Content |
|--------|---------|
| Date & time | `Apr 11, 09:14` |
| Server | `Frankfurt (DE)` |
| Upload | `↑ 2.1 GB` |
| Download | `↓ 8.4 GB` |
| Duration | `1h 23m` |
| Actions | [Terminate] (only for active sessions) |

**Active sessions** shown at top with a pulsing green dot.

**Pagination:** Load 20 rows at a time, "Load more" button at bottom (not infinite scroll — allows users to orient themselves).

**Terminate Session**
- Only available for currently active sessions
- On click: confirmation popover "End this session? The device will be disconnected."
- [Cancel] [Disconnect]
- On success: session moves from "Active" to "Ended" with timestamp

---

## 5.5 Tab: Devices

Lists devices that have used configs:

```
┌────────────────────────────────────────────────────────┐
│  Devices (3)                                           │
│  ──────────────────────────────────────────────────    │
│  📱 iPhone 14               Last seen: just now  [✕]  │
│     Frankfurt · VMess                                  │
│                                                        │
│  💻 MacBook Pro             Last seen: 2h ago    [✕]  │
│     Amsterdam · VLESS                                  │
│                                                        │
│  🖥  Desktop (Unknown)      Last seen: yesterday  [✕]  │
│     Frankfurt · VMess                                  │
└────────────────────────────────────────────────────────┘
```

- Device icon inferred from user-agent (phone / laptop / desktop / unknown)
- Config used shown as secondary line
- [✕] revokes/disconnects device — shows confirmation popover
- "Revoke all other devices" link at bottom of list
- Max devices enforced by plan — shows "3 / 5 devices used" counter
- If at limit: warning banner "You've reached your device limit. Remove a device to connect a new one."

---

## 5.6 Quota Warning States

| Threshold | Treatment |
|-----------|-----------|
| 80% used | Amber usage bar + inline text "80% of your monthly quota used" |
| 95% used | Red usage bar + persistent banner in dashboard home |
| 100% used | Full banner: "You've used all your data. Upgrade to continue." + all configs show locked state |
| Unlimited plan | No quota indicators shown |

**Low quota banner (95%+):**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔴  You've used 97% of your monthly data. [Upgrade Plan →]  ✕  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.7 Data Export

At the bottom of the Usage page:

```
Export your data
[Download CSV — Session History]
[Download PDF — Monthly Report]
```

- CSV: all sessions in current period
- PDF: summary report formatted for record-keeping

---

---

## نمای فارسی — Screen Layout (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> **تاریخ:** شمسی — مثلاً ۱۴۰۵/۱/۲۲ یا ۲۲ فروردین ۱۴۰۵
> **حجم:** گیگابایت (گیگ) با اعداد فارسی در برچسب‌ها

### صفحه اصلی مصرف (دسکتاپ)

```
┌────────────────────────────────────────────────────────────────┐
│                                              مصرف و وضعیت     │
├────────────────────────────────────────────────────────────────┤
│           ۱۴۰۵/۱/۱ – ۱۴۰۵/۱/۲۲   [▼ این ماه]                │
│                                                                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│  │     جلسات    │ │   باقی‌مانده  │ │  مصرف شده    │        │
│  │     ۲۸       │ │   ۵۷.۷ گیگ   │ │  ۴۲.۳ گیگ    │        │
│  │   این ماه    │ │               │ │  از ۱۰۰ گیگ  │        │
│  └───────────────┘ └───────────────┘ └───────────────┘        │
│                                                                │
│                                                مصرف پهنای باند│
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         [نمودار میله‌ای — مصرف روزانه ماه جاری]         │  │
│  │                                                          │  │
│  │  ۲۲فرو  ۲۰فرو  ۱۸فرو  ۱۶فرو  ۱۴فرو  ۱۲فرو  ۱فرو      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│           تب ←  [دستگاه‌ها]  [جلسات]  [مصرف]                 │
│  ─────────────────────────────────────────────────────────     │
│                                             تاریخچه جلسات      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [✕]  ۱ساعت ۲۳دق  ↑۲.۱ ↓۸.۴   فرانکفورت  ۰۹:۱۴  ۱۴۰۵/۱/۲۲│ │
│  │      ۴۵ دقیقه    ↑۰.۴ ↓۳.۲   آمستردام   ۲۲:۰۱  ۱۴۰۵/۱/۲۱│ │
│  │      ۲ساعت ۱۰دق  ↑۱.۸ ↓۷.۱   فرانکفورت  ۱۴:۳۳  ۱۴۰۵/۱/۲۱│ │
│  │                               [بارگذاری بیشتر]            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### تب مصرف — تفکیک (فارسی)

```
┌────────────────────────────────────────────────────────┐
│                 ۲۴%  ░░░░░░████  ۱۲.۴ گیگ    ↑ آپلود  │
│                 ۷۱%  ░░████████  ۲۹.۹ گیگ  ↓ دانلود   │
│                  ۵%  ░░░░░░░░██   ۲.۱ گیگ    سربار/سایر│
└────────────────────────────────────────────────────────┘
```

### تب دستگاه‌ها (فارسی)

```
┌────────────────────────────────────────────────────────┐
│                               (۳) دستگاه‌ها            │
│  ──────────────────────────────────────────────────    │
│  [✕]  همین الان :آخرین اتصال       آیفون ۱۴  📱       │
│                              VMess · فرانکفورت         │
│                                                        │
│  [✕]   ۲ ساعت پیش :آخرین اتصال   مک‌بوک پرو  💻      │
│                              VLESS · آمستردام          │
│                                                        │
│  [✕]    دیروز :آخرین اتصال  (ناشناس) دسکتاپ  🖥       │
│                              VMess · فرانکفورت         │
└────────────────────────────────────────────────────────┘
```

### نوار هشدار حجم (فارسی)

```
┌─────────────────────────────────────────────────────────────────┐
│ ✕  [← ارتقای پلن]  .۹۷٪ از حجم ماهانه مصرف شده است  🔴        │
└─────────────────────────────────────────────────────────────────┘
```

### خروجی داده (فارسی)

```
                                        خروجی داده‌ها
         [دانلود PDF — گزارش ماهانه]
     [دانلود CSV — تاریخچه جلسات]
```

### موبایل (فارسی)

```
┌──────────────────────────┐
│           مصرف و وضعیت  │
│  ──────────────────────  │
│  [▼ این ماه]             │
│                          │
│         ۴۲.۳ گیگ مصرف   │
│     ░░░░▓▓▓▓▓▓▓▓ ۴۲٪    │
│                          │
│  ─────────────────────── │
│  فرانکفورت · ۲۲فرو ۰۹:۱۴│
│  آمستردام  · ۲۱فرو ۲۲:۰۱│
│  [بارگذاری بیشتر]        │
└──────────────────────────┘
```

### نکات RTL برای صفحه مصرف

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| تب‌های سوئیچ | ترتیب از راست: مصرف / جلسات / دستگاه‌ها |
| ستون‌های جدول | تاریخ سمت راست، دکمه اکشن سمت چپ |
| فلش آپلود/دانلود | ↑ ↓ (بدون تغییر — عمودی/فلش‌های نقطه‌ای) |
| انتخابگر دوره | متن از راست، dropdown به سمت راست باز می‌شود |
| نوار پیشرفت مصرف | از راست پر می‌شود |
| اعداد در جدول | لاتین (برای سازگاری با کلاینت‌های VPN) |

---

## Empty States

| Scenario | Display |
|----------|---------|
| No usage yet (new account) | Illustration + "No usage yet. Connect a device to see data here." |
| New month, no data | Same as above but "No data for this period yet." |
| No active sessions | Sessions tab: "No active sessions." |
| No devices detected | Devices tab: "No devices detected. Import a config on your device to get started." |
| Error loading | Error card + retry button |

---

## Mobile Layout & Responsive Behavior

### Breakpoints

| Breakpoint | Stat Cards | Chart | Session Rows | Tabs |
|------------|------------|-------|-------------|------|
| `< 640px` | Stacked (1 col) | Horizontal scroll | Condensed single line | Scrollable row |
| `640–1023px` | 2-column grid | Full width | Condensed | Full labels |
| `≥ 1024px` | 3-column grid | Full width | Full columns | Full labels |

---

### Usage Page — Mobile

```
┌──────────────────────────┐
│  Usage & Status   320px  │
│  [▼ This Month]          │
│  ──────────────────────  │
│  ┌──────────────────┐    │
│  │ Used    42.3 GB  │    │
│  │ of 100 GB        │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ Remaining 57.7 GB│    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ Sessions   28    │    │
│  │ this month       │    │
│  └──────────────────┘    │
│  ──────────────────────  │
│  Bandwidth Usage         │
│  ┌──────────────────┐    │
│  │ [chart scrolls →]│    │
│  └──────────────────┘    │
│  ──────────────────────  │
│  [Usage][Sessions][Devs] │
└──────────────────────────┘
```

---

### Bandwidth Chart — Mobile

The chart is **horizontally scrollable** — not compressed:

```
┌──────────────────────────┐
│  Bandwidth Usage         │
│  ┌────────────────────── ─ ─ ─ ─┐
│  │  ▐█▌  ▐█▌ ▐███▌ ▐██▌ ▐█▌  ··│  scrolls →
│  │  1    3    5     7    9   11  │
│  └─────────────────────── ─ ─ ─ ┘
│   ← swipe to scroll →            │
└──────────────────────────┘
```

- Each bar is min `20px` wide with `4px` gap — readable without pinch-zoom
- Scroll indicator (thin line) shows current position
- Tap a bar → tooltip with that day's exact GB + session count
- Period selector is a full-width `<select>` on mobile (native picker)

---

### Tab: Sessions — Mobile

Each row collapses from multi-column to a single condensed line:

**Desktop row:**
```
Apr 11  09:14  Frankfurt  ↑2.1GB  ↓8.4GB  1h 23m  [✕]
```

**Mobile row:**
```
┌──────────────────────────┐
│ Frankfurt · 1h 23m       │
│ Apr 11, 09:14 · 10.5 GB  │
│                      [✕] │  ← terminate (active only)
└──────────────────────────┘
```

- Active sessions get a left border in green + pulsing dot
- [✕] button is `44px` tap target, right-aligned
- Tap any row → expands to show full upload/download split:
  ```
  ↑ 2.1 GB uploaded  ↓ 8.4 GB downloaded
  ```
- "Load more" button: full-width, centered

---

### Tab: Usage Breakdown — Mobile

Stacked bars replace side-by-side columns:

```
┌──────────────────────────┐
│ Upload    ↑ 12.4 GB  24% │
│ [████░░░░░░░░░░░░░░░░]   │
│                          │
│ Download  ↓ 29.9 GB  71% │
│ [████████████░░░░░░░░]   │
│                          │
│ Overhead    2.1 GB    5% │
│ [██░░░░░░░░░░░░░░░░░░]   │
└──────────────────────────┘
```

---

### Tab: Devices — Mobile

```
┌──────────────────────────┐
│  Devices (3 / 5)         │
│  ──────────────────────  │
│  📱 iPhone 14            │
│     just now · Frankfurt │
│                      [✕] │
│  ──────────────────────  │
│  💻 MacBook Pro          │
│     2h ago · Amsterdam   │
│                      [✕] │
│  ──────────────────────  │
│  🖥 Desktop (Unknown)    │
│     yesterday · Frankfurt│
│                      [✕] │
│  ──────────────────────  │
│  [Revoke all other devs] │
└──────────────────────────┘
```

- [✕] is a `44×44px` touch target, appears inline (not on swipe)
- Swipe left on a device row also reveals a red "Revoke" button

---

### Period Selector — Mobile

Replaces the dropdown with a **native `<select>`** on mobile:

```
┌──────────────────────────┐
│  [▼ This Month        ]  │  ← triggers native iOS/Android picker
└──────────────────────────┘
```

Custom range: two date inputs side by side, each opening the native date picker.

---

### Quota Warning Banner — Mobile

```
┌──────────────────────────┐
│ 🔴 97% used [Upgrade] ✕  │
└──────────────────────────┘
```

Single-line, no body text — tapping the banner opens full detail below it.

---

### Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Pull-to-refresh | Refreshes local demo data for current period |
| Swipe chart left/right | Scrolls bar chart |
| Tap chart bar | Shows tooltip with exact values |
| Tap session row | Expands upload/download split |
| Swipe device row left | Reveals red "Revoke" button |
| Tap [✕] on session | Opens confirmation popover (not full dialog) |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/usage/page.tsx`
- `features/usage/usage-page.tsx`
- Feature-local usage helpers or mock data under `features/usage/` or `mock-data/`

### Reuse Order

1. Use `DashboardPage` and `PageSection` for page composition.
2. Use `TableSection` for session or device listings when tabular layout is needed.
3. Prefer the existing chart primitive in `components/ui/chart.ts` before adding a new charting approach.

### Frontend-Only Rules

- Usage history, session history, devices, and quota thresholds are all mocked.
- Terminate session, revoke device, export CSV, and export PDF are local UI actions only.
- Pull-to-refresh, pagination, and time-range switching only update local state.

### Required View Model

- `period`
- `summary.usedGb`
- `summary.remainingGb`
- `summary.sessionsCount`
- `chartPoints[]`
- `usageBreakdown`
- `sessions[]`
- `devices[]`
- `quotaState`: `normal | warning80 | warning95 | exhausted | unlimited`

### Done Criteria

- Tabs cover populated, empty, loading, and warning variants.
- Chart, session list, and devices list behave correctly with mocked period changes.
- Upgrade banners, revoke actions, and export buttons exist as frontend-only interactions.

### In Scope Now

- Summary cards, chart, usage breakdown, sessions tab, devices tab, quota banners, and export action buttons.

### Out Of Scope Now

- Real device detection, backend session termination, CSV generation, PDF generation, and long-range analytics.

### Sample Data

```ts
const usageDemo = {
  period: "thisMonth",
  summary: { usedGb: 42.3, remainingGb: 57.7, sessionsCount: 28 },
  chartPoints: [
    { day: "Apr 9", gb: 3.2, sessions: 2 },
    { day: "Apr 10", gb: 5.4, sessions: 4 },
    { day: "Apr 11", gb: 4.8, sessions: 3 },
  ],
  sessions: [
    { id: "s1", dateLabel: "Apr 11, 09:14", location: "Frankfurt", upload: 2.1, download: 8.4, duration: "1h 23m", active: true },
  ],
  devices: [
    { id: "d1", name: "iPhone 14", lastSeen: "just now", profile: "Frankfurt · VMess" },
  ],
  quotaState: "warning80",
}
```
