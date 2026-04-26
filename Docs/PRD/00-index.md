# VPN Dashboard — PRD Index

**Product:** Tunnel Dashboard
**Scope:** Frontend Product Spec & Implementation Guide
**Stack:** Next.js · Shadcn/UI · Tailwind CSS · local mock data
**Last Updated:** 2026-04-11

---

## Document Map

| # | Document | Covers |
|---|----------|--------|
| 01 | [Authentication & Onboarding](./01-auth.md) | Login, Signup, Password reset, Email verification, Social auth |
| 02 | [Dashboard Home](./02-dashboard-home.md) | Overview stats, quick actions, status summary |
| 03 | [V2Ray Config Files](./03-configs.md) | Viewing, copying, downloading, QR codes, protocol details |
| 04 | [Payments & Billing](./04-payments.md) | Plans, checkout, invoices, renewal, cancellation |
| 05 | [Usage & Status](./05-usage.md) | Bandwidth, session history, quota alerts, device list |
| 06 | [Design System](./06-design-system.md) | Color, typography, spacing, component library, motion |
| 07 | [Notifications & Alerts](./07-notifications.md) | In-app toasts, email triggers, quota warnings, system alerts |
| 08 | [Referral System](./08-referral.md) | Unique referral codes, signup with code, referral dashboard, rewards |
| 09 | [Download Assets](./09-download-assets.md) | Client app downloads, platform cards, install guidance, OS compatibility |
| 10 | [Wallet](./10-wallet.md) | Personal wallet balance, top-up flow, transaction history, wallet payment tab at checkout |
| 11 | [Representatives](./11-representatives.md) | Rep dashboard, user management, config assignment & extension, wallet-funded charges |

---

## Product Vision

A clean, low-friction self-service portal where VPN subscribers can activate their service in under 60 seconds, retrieve V2Ray configuration in one click, track usage in real time, and manage billing without contacting support.

## Core Principles

1. **Clarity over cleverness** — every screen has one primary action
2. **Progressive disclosure** — technical details (UUIDs, ports, TLS settings) hidden behind expand/copy interactions
3. **Trust signals everywhere** — connection status, expiry dates, and quota are always visible
4. **Mobile-first** — config QR codes and status cards must work on phone screens
5. **Accessible** — WCAG 2.1 AA minimum across all flows

## Frontend Development Context

- Current project phase is **frontend-only**. No backend, database, auth provider, payment provider, email service, or notification delivery service should be implemented at this stage.
- These PRD files are intended to be used directly by AI and developers to build the UI inside this repository.
- Route files should stay thin under `app/`.
- Page assembly should live in `features/`.
- Shared layout and page-shell blocks should come from `components/dashboard/`.
- Reusable primitives should come from `components/ui/` before creating anything new.
- Page data should come from local mock data or feature-local static data only.
- If a workflow mentions server behavior, treat it as a UI state to simulate with local state, fake delays, and static content.

## Repo Build Rules

1. Prefer extending existing page patterns already used in `features/dashboard`, `features/workspaces`, `features/messaging`, and `features/settings`.
2. For dashboard pages, default to `DashboardPage`, `PageSection`, `SectionCard`, `TableSection`, `StatCard`, and `EmptyState` before introducing new shared abstractions.
3. Every page implementation should cover `loading`, `populated`, `empty`, and `error` states even when data is mocked.
4. All user actions should be implemented as client-side interactions unless a doc explicitly says the action is display-only.
5. Avoid inventing API clients, server actions, or persistence layers while building these dashboard screens.
6. Keep copy, layout hierarchy, and responsive behavior aligned with the feature PRDs and the design rules in `06-design-system.md`.

## Mobile & Responsive Strategy

Every screen is designed mobile-first. Full responsive details live in each feature doc and in [06-design-system.md — Section 6.8](./06-design-system.md).

### Global Patterns

| Pattern | Mobile (`< 640px`) | Desktop (`≥ 1024px`) |
|---------|-------------------|---------------------|
| Navigation | Bottom tab bar (4 tabs + "More" sheet) | Fixed left sidebar |
| Modals / Dialogs | Bottom sheet (drag handle, swipe to close) | Centered overlay |
| Drawers | Slides up from bottom | Slides from right |
| Toasts | Bottom-center, above tab bar | Bottom-right |
| Stat cards | Stacked, full-width | 3-column grid |
| Data tables | Condensed single-line rows | Full column layout |
| Charts | Horizontally scrollable | Full width |
| Dropdowns | Native `<select>` picker | Custom styled dropdown |

### Touch Requirements

- Minimum tap target: `44×44px` (WCAG 2.5.5)
- Input `font-size` minimum: `16px` (prevents iOS auto-zoom)
- Bottom safe area respected via `pb-safe` on all fixed elements
- Swipe gestures: left on rows (reveal actions), down on sheets (dismiss), pull-down on pages (refresh)

---

## پشتیبانی فارسی — Persian / RTL

هر سند PRD شامل یک بخش **«نمای فارسی»** است که طرح‌بندی RTL صفحه را به‌طور مستقل مستند می‌کند.

### اصول کلی

| موضوع | تصمیم |
|-------|-------|
| جهت | `dir="rtl"` روی `<html>` |
| فونت | `Vazirmatn` (متغیر) جایگزین `Inter` |
| تاریخ | شمسی در همه رابط‌ها |
| اعداد آماری | فارسی (`۱۲۳`) در برچسب‌ها، لاتین در فیلدهای فنی |
| ارز | تومان / ریال با جداکننده هزارگان (`۱۲۰٬۰۰۰ت`) |
| طرح‌بندی | ستون کناری به راست، محتوا به چپ |
| عناصر آینه‌شده | padding ،margin ،border منطقی (`ms-*`, `ps-*`) |
| عناصر بدون تغییر | QR کد، نمودار زمانی، فیلدهای ایمیل/پسورد |

برای قوانین کامل طراحی RTL، مراجعه کنید به [06-design-system.md — بخش ۶.۸](./06-design-system.md).

---

## Primary User Personas

| Persona | Description | Primary Need |
|---------|-------------|--------------|
| **Everyday User** | Non-technical, uses VPN for privacy | One-tap config import, knows when it expires |
| **Power User** | Tech-savvy, runs multiple devices | Multi-config management, raw JSON access |
| **Admin / Reseller** | Manages accounts for others | Usage overview per account, bulk config download |
| **Representative** | Promoted by Admin; resells VPN configs to end-users | Create & charge configs for their users, pay from wallet, track usage per user |

---

## How To Use These PRDs In This Repo

- Read the feature doc first, then apply the component, spacing, state, and responsive rules from `06-design-system.md`.
- Build the route entry in `app/` and keep it limited to importing mock data and rendering the feature page component.
- Build the page UI inside `features/<feature>/` using existing shared components where possible.
- Keep new shared abstractions rare. If a pattern appears in only one page, prefer a feature-local component instead.
- Treat external integrations as mocked surfaces: auth screens validate locally, billing flows simulate processing, notifications render from local arrays, and referral or usage stats come from static objects.

## Authoring Rules For These PRDs

- Each feature doc should define what is in scope for the first frontend pass and what is intentionally deferred.
- Each feature doc should include at least one concrete sample data object so AI can mirror the expected shape without guessing.
- Each feature doc should describe major UI states in terms of local component state, mocked content, or navigation within the app.
- If a screen mentions an external service, treat that mention as UI copy or a display variant unless the repo explicitly adds the integration later.
