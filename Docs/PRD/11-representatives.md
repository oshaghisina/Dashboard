# 11 — Representatives

## Purpose

Give promoted users (Representatives / نمایندگان) a dedicated panel to manage a pool of end-users, assign and charge VPN configs on their behalf, and pay for all operations from their wallet. Representative access is granted by an Admin only — it cannot be self-requested.

---

## Role & Access

| Attribute | Detail |
|-----------|--------|
| Who can become a Rep | Any existing user, promoted by Admin only |
| How promotion happens | Admin panel action — outside the scope of this frontend pass (treat as a role flag on the mock user object) |
| What changes after promotion | A new **Representatives** section appears in the sidebar and the user's dashboard navigation |
| Wallet | Representatives share the same wallet system (see `10-wallet.md`) — no separate wallet; the same balance is used for all personal and representative operations |

---

## Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/representatives` | Rep overview — stat cards + quick actions |
| `/dashboard/representatives/users` | Full user list |
| `/dashboard/representatives/users/new` | Create a new user |
| `/dashboard/representatives/users/[id]` | User detail — configs + usage |
| `/dashboard/representatives/configs/new` | Assign a new config to a user |

---

## 11.1 Representative Overview

```
┌────────────────────────────────────────────────────────────┐
│  Representatives                                           │
│  Manage your users and their VPN configs                   │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  Total Users │ │Active Configs│ │Wallet Balance│        │
│  │     ۱۴       │ │     ۱۱       │ │  ۳۸۰٬۰۰۰ت   │        │
│  │  +2 this mo  │ │ 3 expiring   │ │  [Top Up]    │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                            │
│  Quick Actions                                             │
│  [+ Add User]   [+ Assign Config]                         │
│                                                            │
│  Expiring Soon                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Ali Rezaei     Frankfurt · VMess   Expires in 2d  │    │
│  │  Sara Mohammadi Amsterdam · VLESS   Expires in 5d  │    │
│  │  Reza Karimi    Tokyo · Trojan      Expires in 6d  │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Stat Cards

| Card | Value | Sub-label |
|------|-------|-----------|
| Total Users | Count of all users under this rep | "+N this month" |
| Active Configs | Count of non-expired configs | "N expiring soon" (amber if > 0) |
| Wallet Balance | Live balance from wallet mock | [Top Up] shortcut link |

- Wallet Balance card: if balance < 50,000 ت, card border turns amber with subtitle "Low balance"
- "Expiring Soon" section: lists configs expiring within 7 days — each row has a [Renew] CTA that opens the charge config flow inline
- Empty state (no users yet): replace stat cards + expiring list with a centered empty state: "No users yet — add your first user to get started." + `[+ Add User]`

---

## 11.2 User List

```
┌────────────────────────────────────────────────────────────┐
│  Users                              [+ Add User]  [Search] │
├──────────────┬────────────┬──────────┬───────────┬─────────┤
│  Name        │ Configs    │ Usage    │ Status    │ Actions │
├──────────────┼────────────┼──────────┼───────────┼─────────┤
│  Ali Rezaei  │ 2 active   │ 38 GB    │ ● Active  │ [View]  │
│  Sara M.     │ 1 active   │ 12 GB    │ ● Active  │ [View]  │
│  Reza Karimi │ 1 expiring │  4 GB    │ ⚠ Expiring│ [View]  │
│  Mina T.     │ 0 active   │  0 GB    │ ○ Inactive│ [View]  │
└──────────────┴────────────┴──────────┴───────────┴─────────┘
```

### Table Columns

| Column | Description |
|--------|-------------|
| Name | Full name; clicking the row navigates to user detail |
| Configs | Count of active configs for this user |
| Usage | Total bandwidth used this billing cycle across all their configs |
| Status | `Active` (green) · `Expiring` (amber) · `Inactive` (muted) |
| Actions | [View] → user detail page |

- Search: filters by name in local state
- Empty state (no users): "You haven't added any users yet." + `[+ Add User]`
- Inactive row (0 active configs): muted row, [View] still works

---

## 11.3 Create User

Accessed via `[+ Add User]` from overview or user list.

```
┌────────────────────────────────────────────────────────────┐
│  Add New User                                              │
├────────────────────────────────────────────────────────────┤
│  Full Name     [                              ]            │
│  Phone / Email [                              ]            │
│  Notes         [                              ]  optional  │
│                                                            │
│  [Cancel]                          [Create User]          │
└────────────────────────────────────────────────────────────┘
```

- Opens as a right-side drawer on desktop, bottom sheet on mobile
- Full Name: required, min 2 chars
- Phone / Email: required, validated format inline (phone `09xxxxxxxxx` or email)
- Notes: optional, 200-char limit, shown only in user detail
- On [Create User]: user is added to the local mock list, drawer closes, success toast: "User created successfully."
- On [Cancel]: close with no changes; if fields are filled, show a "Discard changes?" confirm dialog

---

## 11.4 User Detail

```
┌────────────────────────────────────────────────────────────┐
│  ← Users                                                   │
│  Ali Rezaei                                [+ Assign Config]│
│  ali@example.com · Joined Apr 5, 2026                      │
├────────────────────────────────────────────────────────────┤
│  Configs                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Frankfurt · VMess    ● Active   Expires May 10, 2026  │  │
│  │ Used: 22 GB / 100 GB                [Charge/Extend]  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Amsterdam · VLESS    ● Active   Expires Apr 30, 2026  │  │
│  │ Used: 16 GB / 100 GB                [Charge/Extend]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Usage This Month                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Total Bandwidth       38 GB                       │    │
│  │  Last Active           Apr 25, 2026 · 14:32        │    │
│  │  Sessions This Month   47                          │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Config Rows

- Each config shows: server name, protocol, status badge, expiry date, usage bar (used / total GB)
- `[Charge/Extend]` opens the charge config drawer (§11.5)
- Empty state (no configs): "No configs assigned yet." + `[+ Assign Config]`

### Usage Summary

- Pulled from mock data — total bandwidth, last active timestamp, session count
- Not per-config breakdown here (that lives in the main Configs section of the app, §03)

---

## 11.5 Assign Config (Create Config for a User)

Accessed via `[+ Assign Config]` from overview or user detail.

```
┌────────────────────────────────────────────────────────────┐
│  Assign Config                                             │
├────────────────────────────────────────────────────────────┤
│  User           [Ali Rezaei            ▾]  ← pre-selected │
│                  if opened from user detail                │
│                                                            │
│  Server / Location                                         │
│  [🇩🇪 Frankfurt · VMess   ▾]                               │
│                                                            │
│  Duration       [1 Month ▾]                               │
│  Data Cap       [100 GB  ▾]                               │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│  Cost                                         ۳۰٬۰۰۰ت     │
│  Wallet Balance                               ۳۸۰٬۰۰۰ت    │
│  Balance After                                ۳۵۰٬۰۰۰ت    │
│                                                            │
│  [Cancel]                    [Confirm & Deduct Wallet]     │
└────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Options |
|-------|---------|
| User | Dropdown of rep's users; pre-selected if opened from user detail |
| Server / Location | Dropdown: Frankfurt · VMess, Amsterdam · VLESS, Tokyo · Trojan, etc. |
| Duration | 1 Week · 1 Month · 3 Months · 6 Months · 1 Year |
| Data Cap | 20 GB · 50 GB · 100 GB · Unlimited |

### Cost Summary

- Cost computed from duration × data cap using mock pricing table
- Wallet Balance pulled from wallet mock
- Balance After = Wallet Balance − Cost
- If Balance After < 0: cost row turns red, CTA becomes disabled, error shown: "Insufficient wallet balance. [Top Up →]"

### Confirmation

- `[Confirm & Deduct Wallet]` shows a brief processing overlay, then:
  - Deducts cost from wallet balance in local state
  - Adds config to the user's config list in local state
  - Adds a `config_charge` transaction to wallet history
  - Closes drawer + shows success toast: "Config assigned to Ali Rezaei. ۳۰٬۰۰۰ت deducted from your wallet."

---

## 11.6 Charge / Extend Config

Accessed via `[Charge/Extend]` on a config row in user detail.

```
┌────────────────────────────────────────────────────────────┐
│  Extend Config                                             │
│  Frankfurt · VMess · Ali Rezaei                           │
├────────────────────────────────────────────────────────────┤
│  Current Expiry       May 10, 2026                        │
│  Current Data Used    22 GB / 100 GB                      │
│                                                            │
│  Extend By   [+ 1 Month ▾]   or add data  [+ 50 GB ▾]    │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│  Cost                                         ۱۵٬۰۰۰ت     │
│  New Expiry                               Jun 10, 2026     │
│  New Data Cap                               150 GB         │
│  Wallet Balance                             ۳۵۰٬۰۰۰ت      │
│  Balance After                              ۳۳۵٬۰۰۰ت      │
│                                                            │
│  [Cancel]                    [Confirm & Deduct Wallet]     │
└────────────────────────────────────────────────────────────┘
```

- Duration and data add-ons are independent — rep can extend time only, add data only, or both
- New Expiry and New Data Cap update live as options are changed
- Insufficient balance: same treatment as §11.5
- On confirm: updates config expiry + data cap in local state, deducts wallet, adds transaction, shows toast

---

## نمای فارسی — Screen Layouts (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> **ارز:** تومان
> **تاریخ:** شمسی

---

### ۱۱.۱ نمای کلی نماینده (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                                نمایندگان   │
│                            مدیریت کاربران و کانفیگ‌های آن‌ها│
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  موجودی کیف │ │کانفیگ فعال  │ │  کل کاربران │        │
│  │ ۳۸۰٬۰۰۰ت    │ │     ۱۱      │ │     ۱۴      │        │
│  │ [شارژ کیف]  │ │ ۳ رو به انقضا│ │ +۲ این ماه  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                            │
│                                          اقدامات سریع      │
│                      [تخصیص کانفیگ +]   [افزودن کاربر +]  │
│                                                            │
│                                          به‌زودی منقضی می‌شوند│
│  ┌────────────────────────────────────────────────────┐    │
│  │  تا ۲ روز دیگر   Frankfurt · VMess    علی رضایی  │    │
│  │  تا ۵ روز دیگر   Amsterdam · VLESS   سارا محمدی  │    │
│  │  تا ۶ روز دیگر      Tokyo · Trojan    رضا کریمی  │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

### ۱۱.۵ تخصیص کانفیگ (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                          تخصیص کانفیگ     │
├────────────────────────────────────────────────────────────┤
│                      [▾ علی رضایی            ]  کاربر     │
│                                                            │
│                                        سرور / لوکیشن      │
│                   [▾ Frankfurt · VMess 🇩🇪]               │
│                                                            │
│                        [▾ ۱۰۰ گیگ]  حجم    [▾ ۱ ماه]  مدت│
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                   ۳۰٬۰۰۰ت           هزینه │
│                                  ۳۸۰٬۰۰۰ت    موجودی کیف پول│
│                                  ۳۵۰٬۰۰۰ت       مانده بعد │
│                                                            │
│      [کسر از کیف پول و تأیید]                   [انصراف]  │
└────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout & Responsive Behavior

### Overview — Mobile

```
┌──────────────────────────┐
│  Representatives   320px │
│  ──────────────────────  │
│  ┌────────────────────┐  │
│  │  Users   Configs   │  │
│  │    14       11     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Wallet  ۳۸۰٬۰۰۰ت  │  │
│  │  [Top Up]          │  │
│  └────────────────────┘  │
│  [+ Add User]            │
│  [+ Assign Config]       │
│  ──────────────────────  │
│  Expiring Soon           │
│  Ali R.  Frankfurt  2d   │
│  Sara M. Amsterdam  5d   │
└──────────────────────────┘
```

- Stat cards: Users + Configs in one 2-column card; Wallet in a separate full-width card below
- Quick action buttons: stacked full-width
- Expiring Soon rows: condensed — name · server short name · days remaining

### User List — Mobile

- Full-width rows: name + status badge on one line, configs count + usage on second line
- [View] replaced by tapping the full row
- Search bar: full-width, sticky at top of list

### Create User / Assign Config / Extend Config — Mobile

- All three open as **bottom sheets** (not drawers)
- Form fields: full-width inputs
- Cost summary: sticky section above the CTA at bottom of sheet
- CTA: full-width sticky button above bottom safe area

### Breakpoints

| Breakpoint | Stat cards | User list | Drawers |
|------------|-----------|-----------|---------|
| `< 640px` | Stacked (2+1) | Single column | Bottom sheet |
| `640–1023px` | 3-column | Single column | Bottom sheet |
| `≥ 1024px` | 3-column | Full table | Right drawer |

---

## Frontend Build Notes

### Implementation Targets

- `app/dashboard/representatives/page.tsx`
- `app/dashboard/representatives/users/page.tsx`
- `app/dashboard/representatives/users/new/page.tsx`
- `app/dashboard/representatives/users/[id]/page.tsx`
- `app/dashboard/representatives/configs/new/page.tsx`
- Feature UI under `features/representatives/`

### Role Guard

- All representative routes should check `currentUser.role === "representative"` against mock data
- If a regular user navigates to `/dashboard/representatives`, show a full-page `AccessDenied` state: "This section is available to Representatives only. Contact support to learn more."
- Do not hide the route from the URL — just guard the rendered content

### Frontend-Only Rules

- No backend calls, no real user creation, no config provisioning
- All user creation, config assignment, and extension operations update local mock state only
- Wallet deductions update the shared wallet mock state so the balance reflects correctly across Wallet and Representatives pages within the same session
- Rep promotion is not implemented in this frontend pass — mock user data includes a `role: "representative"` flag

### Required View Models

- Overview: `stats { totalUsers, activeConfigs, walletBalance }`, `expiringSoon[]`
- User list: `users[]`, `searchQuery`
- User detail: `user`, `configs[]`, `usageSummary`
- Assign config: `selectedUser`, `selectedServer`, `duration`, `dataCap`, `cost`, `walletBalance`
- Extend config: `config`, `extendDuration`, `addData`, `newExpiry`, `newDataCap`, `cost`, `walletBalance`

### Done Criteria

- Overview page shows stat cards, quick actions, and expiring-soon list from mock data
- User list supports search and navigates to detail
- Create user form validates and adds to local state
- User detail shows configs with usage bars and extension CTAs
- Assign config flow computes cost, checks balance, and updates wallet + config state on confirm
- Extend config flow mirrors assign config for an existing config row
- Role guard renders AccessDenied for non-representative mock user

### In Scope Now

- All routes and flows listed above, backed entirely by local mock data

### Out Of Scope Now

- Admin panel for promoting users to representative role
- Real config provisioning or user account creation on a backend
- Per-config session logs or detailed analytics beyond the summary shown in user detail

### Sample Data

```ts
const representativeDemo = {
  currentUser: {
    id: "u-rep-01",
    name: "Sina Oshaghi",
    role: "representative",
    walletBalance: 380_000,
  },
  users: [
    {
      id: "u-01",
      name: "Ali Rezaei",
      contact: "ali@example.com",
      status: "active",
      configs: [
        {
          id: "c-01",
          server: "Frankfurt · VMess",
          status: "active",
          expiresAt: "2026-05-10",
          usedGB: 22,
          totalGB: 100,
        },
        {
          id: "c-02",
          server: "Amsterdam · VLESS",
          status: "active",
          expiresAt: "2026-04-30",
          usedGB: 16,
          totalGB: 100,
        },
      ],
      usage: { totalGB: 38, lastActive: "2026-04-25T14:32:00", sessions: 47 },
    },
    {
      id: "u-02",
      name: "Sara Mohammadi",
      contact: "09121234567",
      status: "active",
      configs: [
        {
          id: "c-03",
          server: "Amsterdam · VLESS",
          status: "active",
          expiresAt: "2026-05-01",
          usedGB: 12,
          totalGB: 100,
        },
      ],
      usage: { totalGB: 12, lastActive: "2026-04-24T09:10:00", sessions: 21 },
    },
    {
      id: "u-03",
      name: "Reza Karimi",
      contact: "reza@example.com",
      status: "expiring",
      configs: [
        {
          id: "c-04",
          server: "Tokyo · Trojan",
          status: "expiring",
          expiresAt: "2026-05-01",
          usedGB: 4,
          totalGB: 50,
        },
      ],
      usage: { totalGB: 4, lastActive: "2026-04-22T18:55:00", sessions: 9 },
    },
  ],
  configPricing: {
    "1w-20gb":   5_000,
    "1m-20gb":  10_000,
    "1m-50gb":  20_000,
    "1m-100gb": 30_000,
    "3m-100gb": 80_000,
  },
}
```
