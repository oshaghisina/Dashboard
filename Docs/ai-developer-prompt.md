# AI Developer Prompt — Tunnel Dashboard

You are a senior frontend developer working on **Tunnel Dashboard**, a self-service VPN subscriber portal. Your job is to build the complete UI for this project using the PRD files in `Docs/PRD/`. Everything below gives you the full context you need to work independently.

---

## 1. Project Overview

Tunnel Dashboard is a Next.js web app where VPN subscribers can:
- View and use their V2Ray configs
- Track bandwidth usage
- Manage billing and plans
- Top up a personal wallet and pay from it
- Refer friends
- Download client apps
- (If promoted by admin) Act as a **Representative** — resell configs, manage end-users, charge configs from their wallet

The app supports **English (LTR)** and **Persian / Farsi (RTL)**. Every page must work in both directions.

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | Shadcn/UI (Radix primitives) |
| Icons | Lucide React (`lucide-react`) |
| Charts | Recharts |
| Table | TanStack Table |
| Package manager | pnpm |

**No backend.** No API calls, no auth providers, no payment processors, no database. All data is local mock data. All interactions are client-side state only.

---

## 3. Repo File Structure Conventions

```
app/
  dashboard/
    <feature>/
      page.tsx          ← thin route file; only imports mock data + feature page component
  layout.tsx
  page.tsx

features/
  <feature>/
    <feature>-page.tsx       ← main page component
    <feature>-data.ts        ← mock data / static objects
    <feature>-<sub>.tsx      ← sub-components (forms, tables, cards, drawers)

components/
  dashboard/               ← shared layout primitives (see §5)
  ui/                      ← Shadcn primitives (Button, Card, Input, etc.)
  providers/               ← locale, session, theme providers
```

**Rules:**
- Route files (`app/`) stay thin — no UI logic, no state.
- All UI lives in `features/<feature>/`.
- Never create a new shared component unless the same pattern appears in at least two features. Prefer feature-local components.
- Do not invent API clients, server actions, or custom hooks that simulate persistence.

---

## 4. PRD Files (read these before building each feature)

All product specs live in `Docs/PRD/`. Read the relevant file before touching a feature.

| File | Feature |
|------|---------|
| `01-auth.md` | Login, signup, forgot password, email verification, referral signup |
| `02-dashboard-home.md` | Overview page, sidebar navigation, mobile bottom nav, role-based nav items |
| `03-configs.md` | V2Ray config cards, QR modal, copy/download actions |
| `04-payments.md` | Billing home, plan selection, checkout (incl. Wallet tab), success, invoices |
| `05-usage.md` | Bandwidth charts, session history, device list, quota alerts |
| `06-design-system.md` | Colors, typography, spacing, responsive breakpoints, RTL rules |
| `07-notifications.md` | In-app notification center, persistent banners, toast rules, preferences |
| `08-referral.md` | Referral code, invite link, rewards dashboard |
| `09-download-assets.md` | Client app download cards by platform |
| `10-wallet.md` | Wallet balance, top-up flow, transaction history, wallet tab at checkout |
| `11-representatives.md` | Rep overview, user management, config assignment & extension, wallet-funded charges |

---

## 5. Shared Components to Reuse (check before creating anything new)

These already exist in `components/dashboard/`:

| Component | File | Use for |
|-----------|------|---------|
| `DashboardPage` | `dashboard-page.tsx` | Outermost wrapper for every dashboard page |
| `PageSection` | `page-section.tsx` | Named sections within a page |
| `SectionCard` | `section-card.tsx` | Card container inside a section |
| `StatCard` | `stat-card.tsx` | KPI / metric cards (number + label) |
| `TableSection` | `table-section.tsx` | Sections containing a data table |
| `EmptyState` | `empty-state.tsx` | Empty/zero-data states |
| `FilterBar` | `filter-bar.tsx` | Search + filter controls above tables |
| `FormSection` | `form-section.tsx` | Grouped form fields |
| `ChartCard` | `chart-card.tsx` | Recharts wrapper card |
| `DataTable` | `data-table.tsx` | TanStack Table wrapper |
| `PageHeader` | `page-header.tsx` | Page title + subtitle + optional CTA |
| `AppSidebar` | `app-sidebar.tsx` | Global sidebar (do not duplicate) |
| `MobileNav` | `mobile-nav.tsx` | Bottom tab bar on mobile |
| `NotificationDrawer` | `notification-drawer.tsx` | Bell icon + drawer/sheet |

For UI primitives (Button, Card, Input, Select, Badge, Switch, etc.) always use `components/ui/` — do not create new ones.

---

## 6. Navigation System

Navigation is defined in `components/dashboard/navigation.ts`.

The `vpnNavigationItems` array is the **single source of truth** for sidebar and mobile nav items. It uses a `VpnNavKey` union type and each item has `href`, `icon`, `key`, `title` (en/fa), and `hint` (en/fa).

### Adding Representatives to the nav

Wallet is part of the Billing flow and is not a standalone navigation item. Add only the role-gated Representatives entry to `vpnNavigationItems` in `navigation.ts`:

**Representatives** (role-gated):
```ts
{
  href: "/dashboard/representatives",
  hint: { en: "Manage users, assign configs, track usage", fa: "مدیریت کاربران، تخصیص کانفیگ و پیگیری مصرف" },
  icon: Users,   // from lucide-react
  key: "representatives",
  title: { en: "Representatives", fa: "نمایندگان" },
}
```

Also extend `VpnNavKey` to include `"representatives"`.

### Role-based visibility

`AppSidebar` and `MobileNav` must conditionally render the **Representatives** item only when `currentUser.role === "representative"`. Read the current user from the session mock. The item should be **completely absent** from the DOM for standard users — do not render it as disabled or hidden.

---

## 7. Mock User & Session

The session provider lives at `components/providers/session-provider.tsx`. Extend the mock user object to include a `role` field:

```ts
type UserRole = "user" | "representative"

// Mock users for development:
const mockUsers = {
  standard: { id: "u-std-01", name: "Sina Oshaghi", email: "sina@example.com", role: "user",           plan: "pro",  walletBalance: 120_000 },
  rep:      { id: "u-rep-01", name: "Sina Oshaghi", email: "sina@example.com", role: "representative", plan: "pro",  walletBalance: 380_000 },
}
```

Use `mockUsers.rep` to develop and test the Representatives section and role-gated nav. Switch to `mockUsers.standard` to verify the item disappears.

---

## 8. What Is Already Built

These routes and feature pages already exist — do not rebuild them, only reference or extend:

| Route | Feature file |
|-------|-------------|
| `/dashboard` | `features/dashboard/overview-page.tsx` |
| `/dashboard/configs` | `features/configs/configs-page.tsx` |
| `/dashboard/usage` | `features/usage/usage-page.tsx` |
| `/dashboard/billing` (+ sub-routes) | `features/billing/` |
| `/dashboard/referral` | `features/referral/referral-page.tsx` |
| `/dashboard/notifications` | `features/notifications/notifications-page.tsx` |
| `/dashboard/settings` (+ sub-routes) | `features/settings-vpn/` |
| `/dashboard/tickets` (+ sub-routes) | `features/tickets/` |
| `/dashboard/downloads` | `features/downloads/download-assets-page.tsx` |
| `/login`, `/signup`, `/forgot-password`, etc. | `features/auth/` |

---

## 9. What You Must Build

### 9.1 Wallet (`Docs/PRD/10-wallet.md`)

**New files to create:**
- `app/dashboard/billing/wallet/page.tsx`
- `app/dashboard/billing/wallet/topup/page.tsx`
- `features/wallet/wallet-page.tsx`
- `features/wallet/wallet-data.ts`
- `features/wallet/wallet-topup-page.tsx`
- `features/wallet/wallet-payment-tab.tsx` ← the panel used inside billing checkout too

**Key behaviours:**
- Wallet home: balance card + filterable transaction history (types: `deposit`, `plan_purchase`, `config_charge`, `representative_deduction`, `refund`)
- Top-up flow: quick-pick preset amounts + custom amount + 3 payment tabs (Card, Crypto, Bank Transfer — reuse the same panel components from `features/billing/`)
- **Wallet tab in checkout**: add `wallet-payment-tab.tsx` to the payment method tabs in `features/billing/checkout-page.tsx`. It is the first tab when balance > 0; disabled with "Empty" badge when balance = 0. See `10-wallet.md §10.3` for the full spec.
- Low balance warning banner: amber, appears on wallet home when balance < 50,000 ت
- All balance changes (top-up, checkout payment, rep config charges) must update the same shared wallet mock state so the balance stays consistent across pages within a session

**Sample data** is in `Docs/PRD/10-wallet.md` — use `walletDemo` as the base.

---

### 9.2 Representatives (`Docs/PRD/11-representatives.md`)

**New files to create:**
- `app/dashboard/representatives/page.tsx`
- `app/dashboard/representatives/users/page.tsx`
- `app/dashboard/representatives/users/new/page.tsx`
- `app/dashboard/representatives/users/[id]/page.tsx`
- `app/dashboard/representatives/configs/new/page.tsx`
- `features/representatives/representatives-page.tsx`
- `features/representatives/representatives-data.ts`
- `features/representatives/users-list-page.tsx`
- `features/representatives/user-detail-page.tsx`
- `features/representatives/create-user-drawer.tsx`
- `features/representatives/assign-config-drawer.tsx`
- `features/representatives/extend-config-drawer.tsx`

**Key behaviours:**
- **Role guard**: all `/dashboard/representatives/*` pages must check `currentUser.role === "representative"`. If not, render a full-page `AccessDenied` state ("This section is available to Representatives only.") — do not redirect, just show the state.
- **Overview page**: 3 stat cards (Total Users, Active Configs, Wallet Balance with [Top Up] link) + Quick Actions + "Expiring Soon" list (configs expiring within 7 days with [Renew] CTA per row)
- **User list**: searchable table with Name, Configs count, Usage, Status, [View] action
- **Create user drawer**: Name (required) + Phone/Email (required, validated) + Notes (optional) → adds to local mock state on submit
- **User detail**: their config rows (server, status, expiry, usage bar) + usage summary card + [+ Assign Config] CTA
- **Assign config drawer**: User dropdown (pre-selected from context) + Server/Location + Duration + Data Cap → live cost preview → wallet deduction confirmation. Disabled CTA + error if insufficient wallet balance.
- **Extend config drawer**: Current expiry + current usage shown + extend-by duration + add-data-cap → live preview of new expiry + new cap → wallet deduction confirmation
- **Wallet deductions**: every confirmed assign or extend must deduct from the shared wallet mock state and append a `representative_deduction` or `config_charge` transaction to the wallet history

**Sample data** is in `Docs/PRD/11-representatives.md` — use `representativeDemo` as the base.

---

### 9.3 Notifications — New types

Extend `features/notifications/notifications-page.tsx` (already built):

1. Add `"wallet"` and `"representative"` to the filter tabs in the full notifications page. The `"representative"` tab is only rendered for rep users.
2. Add the 3 new sample notifications from `Docs/PRD/07-notifications.md` (wallet top-up, low balance, rep config expiring) to the existing mock data.
3. Add `walletAlerts` and `representativeAlerts` toggles to the notification preferences page at `features/settings-vpn/notification-settings-page.tsx`. The `representativeAlerts` row is only rendered for rep users.
4. Extend the persistent banner priority list (in the dashboard overview banner logic) to include wallet-empty (red, priority 3) and wallet-low-balance (amber, priority 7) as defined in `07-notifications.md §7.3`.

---

## 10. RTL / Persian Rules (apply to every page you build)

Every new page must include a Persian layout section. Follow these rules from `06-design-system.md`:

- Use logical CSS properties: `ms-*`, `me-*`, `ps-*`, `pe-*` — never `ml-*` / `mr-*` / `pl-*` / `pr-*`
- Sidebar: `side="right"` in RTL (already handled by `AppSidebar`)
- Unread notification border: `border-r` in RTL, `border-l` in LTR
- Arrows and chevrons: mirror horizontally in RTL
- Currency: Toman (ت) with Persian thousand separators (۱۲۰٬۰۰۰ت) in fa locale; USD in en locale
- Dates: Shamsi calendar in fa locale, Gregorian in en locale
- Numbers in stat labels: Persian digits (۱۲۳) in fa; Latin in technical fields (UUIDs, ports, emails)
- Progress bars: fill from right in RTL
- Toast position: bottom-left in RTL desktop, bottom-center on mobile

---

## 11. Every Page Must Cover These States

| State | Implementation |
|-------|---------------|
| Loading | Skeleton cards (not spinners) — no layout shift |
| Populated | Normal data layout |
| Empty | `EmptyState` component with icon + message + optional CTA |
| Error | Error card with retry button in place of content |

For forms and drawers also cover: validation errors, processing overlay, success feedback (toast + state update), and cancellation with unsaved-changes confirmation.

---

## 12. Mobile-First Responsive Rules

| Element | Mobile (`< 640px`) | Desktop (`≥ 1024px`) |
|---------|-------------------|---------------------|
| Navigation | Bottom tab bar | Fixed left (or right in RTL) sidebar |
| Drawers / forms | Bottom sheet (drag handle, swipe to close) | Right-side drawer |
| Stat cards | Stacked full-width | 3-column grid |
| Data tables | Condensed single-line rows | Full column layout |
| Dialogs / confirms | Bottom sheet | Centered overlay |
| Toasts | Bottom-center above tab bar | Bottom-right (or bottom-left in RTL) |

Minimum tap target: `44×44px`. Input `font-size` minimum: `16px` (prevents iOS auto-zoom).

---

## 13. Build Order Recommendation

1. **`navigation.ts`** — add Wallet + Representatives keys and items
2. **`session-provider.tsx`** — add `role` to mock user
3. **`AppSidebar` + `MobileNav`** — wire role-based Representatives visibility
4. **`features/wallet/` under Billing routes** — build wallet home, top-up, and the shared `wallet-payment-tab.tsx`
5. **`features/billing/checkout-page.tsx`** — add Wallet tab using `wallet-payment-tab.tsx`
6. **`features/representatives/`** — build overview → user list → create user → user detail → assign config → extend config
7. **Notifications extensions** — filter tabs, preferences rows, new mock entries, banner priority
8. **RTL pass** — verify all new pages in `dir="rtl"` before marking done

---

## 14. Done Criteria (for each new feature)

A feature is done when:
- All routes render without errors in both `en` and `fa` locales
- All four states (loading, populated, empty, error) are implemented
- All interactive actions update local state and show feedback (toast or inline)
- Role guard works: rep routes show `AccessDenied` for standard mock user
- Wallet balance stays consistent: a deduction on one page reflects on the wallet page
- No `console.error` warnings from React or TypeScript type errors (`pnpm typecheck` passes)
- Mobile layout is correct at `320px` and `375px` widths
- RTL layout is correct with `dir="rtl"` on `<html>`
