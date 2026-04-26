# 07 — Notifications & Alerts

## Purpose

Keep users informed about events that matter (quota limits, plan expiry, payment success/failure, new configs) without overwhelming them — using the right channel at the right moment.

---

## 7.1 In-App Notification Center

### Bell Icon (top nav)

- Shows unread count badge (red dot with number, max "9+")
- Click opens a notification drawer from the right
- Unread indicator disappears after viewing the drawer

### Notification Drawer

```
┌─────────────────────────────────────┐
│  Notifications           [Mark all read]│
│  ─────────────────────────────────  │
│  ● Data usage at 80%     2h ago     │
│    You've used 80 GB of 100 GB      │
│    [Upgrade Plan →]                 │
│  ─────────────────────────────────  │
│    Payment confirmed     Apr 10     │
│    Pro plan renewed for 1 month     │
│    [View Receipt →]                 │
│  ─────────────────────────────────  │
│    Config updated        Apr 8      │
│    Frankfurt config profile updated │
│  ─────────────────────────────────  │
│  [View all notifications]           │
└─────────────────────────────────────┘
```

- Unread items have filled left border in brand color
- Each notification: title, body (1–2 lines), timestamp, optional CTA link
- Timestamps: relative ("2h ago", "Yesterday") for <7 days; absolute for older
- Max 5 items in drawer, "View all" links to `/dashboard/notifications`

---

---

---

## Mobile Layout & Responsive Behavior

### Breakpoints

| Breakpoint | Notification Drawer | Banners | Toasts |
|------------|-------------------|---------|--------|
| `< 640px` | Full-screen bottom sheet | Full-width, 1-line | Bottom-center |
| `640–1023px` | Right-side drawer (360px) | Full-width | Bottom-right |
| `≥ 1024px` | Right-side drawer (380px) | Full-width | Bottom-right |

---

### Bell Icon & Drawer — Mobile

On mobile, tapping the bell opens a **full-screen bottom sheet** instead of a side drawer:

```
┌──────────────────────────┐
│  ────                    │  ← drag handle
│  Notifications           │
│  [Mark all read]         │
│  ──────────────────────  │
│  ● Data usage at 80%     │
│    You've used 80/100 GB │
│    [Upgrade Plan →]      │
│  2h ago                  │
│  ──────────────────────  │
│    Payment confirmed     │
│    Pro plan renewed      │
│    [View Receipt →]      │
│  Apr 10                  │
│  ──────────────────────  │
│    Config updated Apr 8  │
│    Frankfurt updated     │
│  ──────────────────────  │
│  [View all notifications]│
│  ────────                │  ← safe area
└──────────────────────────┘
```

- Sheet height: `85vh`, internally scrollable
- Swipe down to close
- Unread badge on bell: red circle, max "9+", positioned top-right of icon

---

### Persistent Dashboard Banners — Mobile

Banners collapse to a **single-line format** on mobile to preserve screen space:

**Full desktop banner:**
```
⚠  Your plan expires in 5 days.  [Renew Now →]  ✕
```

**Mobile single-line:**
```
┌──────────────────────────┐
│ ⚠ Expires in 5 days [Renew] ✕ │
└──────────────────────────┘
```

- Text truncated if needed — tap banner to expand full message
- `✕` dismiss: `44px` tap target, right-aligned
- CTA: inline, right of message — if no room, wraps to next line

**Expanded state (tap to expand):**
```
┌──────────────────────────┐
│ ⚠ Your plan expires in   │
│   5 days (Apr 14).       │
│   [Renew Now →]      ✕  │
└──────────────────────────┘
```

---

### Toast Notifications — Mobile

Position: **bottom-center**, `16px` above the bottom tab bar (or safe area edge if no tab bar):

```
        ┌──────────────────────┐
        │  ✓  Link copied!     │
        └──────────────────────┘
[Home][Configs][Usage][More]
```

- Max width: `calc(100vw - 32px)`
- Stack limit: 2 toasts visible at once (third queues behind)
- Swipe up to dismiss early
- Tap to dismiss

---

### Notification Preferences — Mobile

```
┌──────────────────────────┐
│  Notification Settings   │
│  ──────────────────────  │
│  Quota Alerts            │
│  Email [●]  In-App [●]   │
│  ──────────────────────  │
│  Plan Expiry Reminders   │
│  Email [●]  In-App [●]   │
│  ──────────────────────  │
│  Payment Receipts        │
│  Email [●]  In-App [●]   │
│  ──────────────────────  │
│  Config Changes          │
│  Email [○]  In-App [●]   │
│  ──────────────────────  │
│  Security Alerts 🔒      │
│  Email [●]  In-App [●]   │
│  (Cannot be disabled)    │
│  ──────────────────────  │
│  [   Save Preferences  ] │
└──────────────────────────┘
```

- Each preference: full-width row, label above, toggle switches below
- Toggles: `48×28px` — meets minimum touch target with label included
- "Save Preferences" is a sticky bottom CTA on mobile (fixed above safe area)

---

### Full Notifications Page — Mobile

```
┌──────────────────────────┐
│  All Notifications  [⚙]  │
│  ──────────────────────  │
│  [All][Billing][Usage]→  │  ← horizontal scroll tabs
│  ──────────────────────  │
│  ● Usage alert  2h ago   │
│    80% of monthly data   │
│    [Upgrade Plan →]      │
│  ──────────────────────  │
│    Payment confirmed     │
│    Apr 10 · #TUN-0411    │
│    [View Receipt →]      │
│  ──────────────────────  │
│  [Load more]             │
└──────────────────────────┘
```

- Filter tabs: horizontally scrollable (`overflow-x: auto`), no wrapping
- Each notification: full-width card with `p-4` padding
- CTA links: full-row tap target
- Unread: left `3px` border in brand color

---

### Security Alert — Mobile

Appears as a **banner below the top bar** (not a bottom sheet — requires immediate attention):

```
┌──────────────────────────┐
│ 🔒 New sign-in detected  │
│    iPhone · just now     │
│ [Was this you?][Secure→] │
└──────────────────────────┘
```

- Fixed below top bar, above page content
- Does not scroll away
- Both buttons visible — if no room, "Secure account" is prioritized

---

### Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Tap bell icon | Opens full-screen bottom sheet |
| Swipe sheet down | Closes notification center |
| Swipe notification item left | Reveals "Mark read" + "Delete" buttons |
| Tap notification row | Opens linked action (e.g., billing page) |
| Swipe toast up | Dismisses early |
| Tap persistent banner | Expands to show full message |
| Long-press toast | Pauses auto-dismiss timer |

---

## نمای فارسی — Screen Layouts (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)

### درج اعلان‌ها (فارسی)

```
┌─────────────────────────────────────┐
│  [خواندن همه]              اعلان‌ها  │
│  ─────────────────────────────────  │
│  ● مصرف به ۸۰٪ رسید    ۲ ساعت پیش  │
│    ۱۰۰ گیگ از ۸۰ گیگ مصرف کردید    │
│                     [← ارتقای پلن]  │
│  ─────────────────────────────────  │
│    پرداخت تأیید شد        ۲۱ فرو   │
│    پلن حرفه‌ای برای ۱ ماه تمدید شد  │
│                       [← مشاهده رسید│
│  ─────────────────────────────────  │
│    کانفیگ بروز شد         ۱۹ فرو   │
│              سرور فرانکفورت بروز شد  │
│  ─────────────────────────────────  │
│            [مشاهده همه اعلان‌ها]    │
└─────────────────────────────────────┘
```

- آیتم‌های خوانده‌نشده: حاشیه پر سمت **راست** (نه چپ) با رنگ برند
- زمان‌سنج سمت چپ، عنوان اعلان سمت راست
- دکمه «خواندن همه» سمت چپ هدر

### نوار اعلان ثابت — منقضی شده (فارسی)

```
┌─────────────────────────────────────────────────────────────────┐
│    [← تمدید کنید]  .پلن شما منقضی شد. کانفیگ‌ها غیرفعال شدند 🔴│
└─────────────────────────────────────────────────────────────────┘
```

### نوار اعلان — انقضای نزدیک (فارسی)

```
┌─────────────────────────────────────────────────────────────────┐
│ ✕  [← تمدید کنید]  .(۱۴ فروردین) روز دیگر منقضی می‌شود ۳ ⚠    │
└─────────────────────────────────────────────────────────────────┘
```

### نوار اعلان — حجم ۹۵٪ (فارسی)

```
┌─────────────────────────────────────────────────────────────────┐
│ ✕  [← ارتقای پلن]  .۹۵٪ از حجم ماهانه مصرف شده است ⚠          │
└─────────────────────────────────────────────────────────────────┘
```

### تنظیمات اعلان (فارسی)

```
┌────────────────────────────────────────────────────────┐
│                              تنظیمات اعلان‌ها           │
│  ──────────────────────────────────────────────────    │
│  [✓] درون‌برنامه  [✓] ایمیل              هشدار حجم     │
│  [✓] درون‌برنامه  [✓] ایمیل   یادآوری انقضای پلن       │
│  [✓] درون‌برنامه  [✓] ایمیل          رسیدهای پرداخت    │
│  [✓] درون‌برنامه  [✗] ایمیل          تغییرات کانفیگ    │
│  [✓] درون‌برنامه  [✓] ایمیل           هشدارهای امنیتی  │
│                      (قفل — قابل غیرفعال‌سازی نیست)    │
│  ──────────────────────────────────────────────────    │
│                         [ذخیره تنظیمات]                │
└────────────────────────────────────────────────────────┘
```

- تیک‌باکس سمت چپ هر ردیف (در RTL، چون عنوان از راست شروع می‌شود)
- ردیف «هشدارهای امنیتی» قفل است و رنگ متن آن کمرنگ‌تر

### هشدار امنیتی درون‌برنامه (فارسی)

```
┌──────────────────────────────────────────────────────────┐
│                      ورود جدید تشخیص داده شد 🔒          │
│              همین الان · فرانکفورت · آیفون               │
│           [امن‌سازی حساب]    [آیا این شما بودید؟]        │
└──────────────────────────────────────────────────────────┘
```

### صفحه همه اعلان‌ها (فارسی)

```
┌──────────────────────────────────────────────────────────────┐
│  [⚙] [خواندن همه]                        همه اعلان‌ها        │
│  ──────────────────────────────────────────────────────────  │
│  [سیستم] [امنیتی] [مصرف] [صورتحساب] [همه] :فیلتر            │
│  ──────────────────────────────────────────────────────────  │
│  ● هشدار مصرف                                   ۲ ساعت پیش  │
│    .۸۰٪ از حجم ماهانه مصرف شده است                          │
│                                         [← ارتقای پلن]      │
│  ─────────────────────────────────────────────────────────   │
│    پرداخت تأیید شد                              ۲۱ فروردین  │
│    TUN-0411-001# .پلن حرفه‌ای با موفقیت تمدید شد             │
│                                        [← مشاهده رسید]      │
│  ─────────────────────────────────────────────────────────   │
│                             [بارگذاری بیشتر]                 │
└──────────────────────────────────────────────────────────────┘
```

### نکات RTL برای اعلان‌ها

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| خط رنگی آیتم خوانده‌نشده | سمت راست (`border-r`) |
| زمان‌سنج | سمت چپ هر ردیف |
| دکمه بستن نوار (✕) | سمت چپ نوار |
| CTA نوار | سمت راست یا وسط (قبل از متن) |
| آیکون زنگ | موقعیت بدون تغییر در topbar |
| نشان تعداد روی زنگ | سمت چپ آیکون (در RTL) |
| تب‌های فیلتر صفحه اعلان | از راست شروع می‌شوند |
| Toast ها | bottom-left دسکتاپ (نه right) |

---

## 7.2 Notification Types

| Type | Trigger | Priority | In-App | Email | Toast |
|------|---------|----------|--------|-------|-------|
| Quota 80% | 80% bandwidth used | Medium | ✓ | ✓ | ✓ (once) |
| Quota 95% | 95% bandwidth used | High | ✓ | ✓ | ✓ |
| Quota 100% | 100% bandwidth used | Critical | ✓ | ✓ | Persistent banner |
| Plan expiring (7 days) | 7 days before expiry | Medium | ✓ | ✓ | — |
| Plan expiring (1 day) | 1 day before expiry | High | ✓ | ✓ | ✓ |
| Plan expired | Day of expiry | Critical | ✓ | ✓ | Persistent banner |
| Payment success | Successful charge | Info | ✓ | ✓ | ✓ |
| Payment failed | Failed charge | High | ✓ | ✓ | ✓ |
| New config available | Admin adds config | Info | ✓ | — | ✓ |
| Config updated | Server migration | Info | ✓ | — | ✓ |
| New login | Unrecognized device | Security | ✓ | ✓ | — |
| Password changed | User changes password | Security | ✓ | ✓ | — |

---

## 7.3 Persistent Dashboard Banners

Banners appear at the top of the main content area (below page header). Only one banner shown at a time; highest priority wins.

### Priority Order (highest first)

1. Plan expired — red
2. Quota 100% — red
3. Plan expiring ≤1 day — red
4. Quota ≥95% — amber
5. Plan expiring ≤7 days — amber

### Banner Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ [Icon]  [Message text]                    [CTA Button]    [✕]  │
└─────────────────────────────────────────────────────────────────┘
```

- Icon: lucide icon matching type (AlertTriangle, XCircle, Bell)
- Dismissible: yes, session-scoped (reappears on next login)
- Non-dismissible: only for 100% quota and expired plan (too critical)

### Banner Examples

**Expired (critical — not dismissible):**
```
🔴 Your plan expired on Apr 29. Your configs have been disabled. [Renew Now →]
```

**Expiring soon (dismissible):**
```
⚠  Your plan expires in 3 days (Apr 14).  [Renew Now →]  ✕
```

**Quota 95% (dismissible once per day):**
```
⚠  You've used 95% of your monthly data.  [Upgrade Plan →]  ✕
```

---

## 7.4 Toast Notifications

Appear bottom-right (desktop) / bottom-center (mobile). Auto-dismiss unless persistent.

| Scenario | Type | Duration | Persistent? |
|----------|------|----------|-------------|
| Config link copied | `default` | 2s | No |
| Payment success | `success` | 5s | No |
| Payment failed | `destructive` | 8s | No |
| Session terminated | `default` | 3s | No |
| Plan renewed | `success` | 5s | No |
| Network error | `destructive` | — | Yes (until dismissed) |

---

## 7.5 Notification Preferences

Located at `/dashboard/settings/notifications`:

```
┌────────────────────────────────────────────────────────┐
│  Notification Preferences                              │
│  ────────────────────────────────────────────────      │
│  Quota Alerts             Email  [✓]  In-App  [✓]     │
│  Plan Expiry Reminders    Email  [✓]  In-App  [✓]     │
│  Payment Receipts         Email  [✓]  In-App  [✓]     │
│  Config Changes           Email  [✗]  In-App  [✓]     │
│  Security Alerts          Email  [✓]  In-App  [✓]     │
│                           (locked — cannot disable)    │
│  ────────────────────────────────────────────────      │
│  [Save Preferences]                                    │
└────────────────────────────────────────────────────────┘
```

- Security alerts (new login, password change) cannot be disabled
- Changes save immediately with success toast
- Email preference changes take effect within a few minutes

---

## 7.6 Security Notifications

### New Device Login Email

Subject: `New sign-in to your Tunnel account`

Body:
- Time + timezone
- Location (city, country from IP)
- Device/browser string
- "If this wasn't you, [secure your account →]" CTA
- Link to active sessions page

### In-App Security Alert

Shown as a high-priority notification with a lock icon. If a new login is detected during an active session:

```
┌──────────────────────────────────────────────────────────┐
│ 🔒 New sign-in detected                                  │
│    iPhone · Frankfurt · just now                         │
│    [Was this you?]  [Secure account]                     │
└──────────────────────────────────────────────────────────┘
```

---

## 7.7 Full Notifications Page

`/dashboard/notifications` — paginated list of all notifications:

```
┌──────────────────────────────────────────────────────────────┐
│  All Notifications                    [Mark all read] [⚙]   │
│  ──────────────────────────────────────────────────────────  │
│  Filter: [All] [Billing] [Usage] [Security] [System]         │
│  ──────────────────────────────────────────────────────────  │
│  ● Usage alert          2h ago                               │
│    You've used 80% of your monthly data.                     │
│    [Upgrade Plan →]                                          │
│  ─────────────────────────────────────────────────────────   │
│    Payment confirmed    Apr 10                               │
│    Pro plan renewed successfully. Receipt #TUN-0411-001      │
│    [View Receipt →]                                          │
│  ─────────────────────────────────────────────────────────   │
│  [Load more]                                                 │
└──────────────────────────────────────────────────────────────┘
```

- Filter tabs for notification categories
- Gear icon → notification preferences
- Load 20 at a time
- Unread: bold title + left border
- Read: regular weight, no border

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/notifications/page.tsx`
- Feature UI under `features/notifications/`
- Optional shared top-bar trigger only after the full notifications page is stable

### Frontend-Only Rules

- No push delivery, email delivery, websocket updates, or persistence layer is part of this phase.
- All notifications, unread counts, filters, and preference values come from local mock data.
- `Mark all read`, `Delete`, `Save Preferences`, and CTA clicks are client-side interactions only.
- Security alerts and billing notices are display variants, not live system events.

### Required View Model

- `notifications[]`
- `notifications[i].id`
- `notifications[i].type`: `billing | usage | security | system | config`
- `notifications[i].read`
- `notifications[i].title`
- `notifications[i].body`
- `notifications[i].timestamp`
- `notifications[i].ctaLabel`
- `notifications[i].ctaHref`
- `preferences`

### Scope Notes

- Build the full notifications page first.
- The bell drawer or bottom sheet should reuse the same mock dataset and can be extracted after the main page exists.
- If top-nav integration is not yet in place, keep the drawer spec as a later UI extraction, not a blocker.

### Done Criteria

- The page covers unread, read, empty, filtered, mobile-sheet, and security-alert states.
- Local interactions update visual state immediately.
- No background sync or provider integration is introduced.

### In Scope Now

- Full notifications page, category filters, unread/read variants, preferences screen, and mobile drawer or sheet behavior as local UI.

### Out Of Scope Now

- Push delivery, email delivery, live updates, persisted preferences, and top-bar wiring beyond demo integration.

### Notification Sort Order

- Newest first
- Unread grouped visually by styling only, not by a separate list
- Security alerts retain highest visual urgency but still follow newest-first ordering in the list

### Sample Data

```ts
const notificationsDemo = {
        notifications: [
                {
                        id: "n1",
                        type: "usage",
                        read: false,
                        title: "Data usage at 80%",
                        body: "You've used 80 GB of 100 GB this month.",
                        timestamp: "2h ago",
                        ctaLabel: "Upgrade Plan",
                        ctaHref: "/dashboard/billing/plans",
                },
                {
                        id: "n2",
                        type: "billing",
                        read: true,
                        title: "Payment confirmed",
                        body: "Pro plan renewed for 1 month.",
                        timestamp: "Apr 10",
                        ctaLabel: "View Receipt",
                        ctaHref: "/dashboard/billing/invoices/TUN-0411-001",
                },
        ],
        preferences: {
                quotaAlerts: { email: true, inApp: true },
                configChanges: { email: false, inApp: true },
        },
}
```
