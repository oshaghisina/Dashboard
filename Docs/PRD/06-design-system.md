# 06 — Design System

## Purpose

Define the visual language, component standards, and interaction patterns that make the dashboard feel consistent, professional, and trustworthy — building on the existing Shadcn/UI + Tailwind foundation.

---

## 6.1 Color Palette

### Semantic Colors (map to Tailwind + CSS variables)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-brand` | `#2563EB` (blue-600) | `#3B82F6` (blue-500) | Primary CTAs, active nav items, links |
| `--color-success` | `#16A34A` (green-600) | `#22C55E` (green-500) | Active status, success toasts, positive trends |
| `--color-warning` | `#D97706` (amber-600) | `#F59E0B` (amber-500) | Expiry warnings, 80%+ quota |
| `--color-danger` | `#DC2626` (red-600) | `#EF4444` (red-500) | Errors, expired plans, 95%+ quota |
| `--color-neutral` | `#6B7280` (gray-500) | `#9CA3AF` (gray-400) | Secondary text, disabled states |

### Surface Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `white` | `gray-950` | Page background |
| Surface | `gray-50` | `gray-900` | Cards, sidebar |
| Surface raised | `white` | `gray-800` | Modals, dropdowns |
| Border | `gray-200` | `gray-700` | Card borders, dividers |

---

## 6.2 Typography

**Font Stack:** System UI → `Inter` → sans-serif

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 12px | 400 | 1.5 | Badges, captions, timestamps |
| `text-sm` | 14px | 400/500 | 1.5 | Body text, form labels, table rows |
| `text-base` | 16px | 400 | 1.6 | Default prose, descriptions |
| `text-lg` | 18px | 600 | 1.4 | Section headings |
| `text-xl` | 20px | 700 | 1.3 | Page titles (mobile) |
| `text-2xl` | 24px | 700 | 1.2 | Page titles (desktop) |
| `text-4xl` | 36px | 800 | 1.1 | Stat numbers (GB used, days left) |

**Heading hierarchy within pages:**
- `h1` — page title (one per page)
- `h2` — section title
- `h3` — card title
- Avoid skipping levels

---

## 6.3 Spacing System

Use Tailwind's 4px base unit consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` | 8px | Between inline elements |
| `gap-4` | 16px | Between cards in a row |
| `gap-6` | 24px | Between page sections |
| `p-4` | 16px | Card internal padding (mobile) |
| `p-6` | 24px | Card internal padding (desktop) |
| `px-6 py-4` | — | Page header padding |

---

## 6.4 Layout Grid

| Breakpoint | Sidebar | Content columns |
|------------|---------|-----------------|
| `< 640px` | Hidden (bottom nav) | 1 |
| `640–1023px` | 64px icon-only | 1 |
| `1024–1279px` | 220px | 2 |
| `≥ 1280px` | 240px | 3 |

Page max-width: `1440px` centered.
Content area max-width: `1200px`.

---

## 6.5 Component Standards

### Buttons

| Variant | Usage | Style |
|---------|-------|-------|
| `default` (filled) | Primary action per section | `bg-brand text-white` |
| `outline` | Secondary actions | `border text-foreground` |
| `ghost` | Tertiary, nav items | `hover:bg-muted` |
| `destructive` | Cancel, delete, revoke | `bg-red-600 text-white` |
| `link` | Inline text actions | `underline text-brand` |

Size variants: `sm` (form rows), `default` (standard), `lg` (hero CTAs).

Loading state: replace label with spinner + text ("Saving…"), disable button.

### Badges / Status Chips

```
● Active      — green dot + text, bg-green-50 border-green-200
● Expiring    — amber dot + text, bg-amber-50 border-amber-200
● Expired     — red dot + text, bg-red-50 border-red-200
● Inactive    — gray dot + text, bg-gray-100 border-gray-200
```

Protocol chips (config page): pill shape, `text-xs`, color-neutral:
`VMess` `VLESS` `Trojan` `TLS` `WS` `gRPC`

### Cards

Standard card: `rounded-xl border bg-card shadow-sm p-6`
Hover (interactive card): `hover:shadow-md transition-shadow`
Selected/highlighted: `ring-2 ring-brand`

### Form Inputs

- Label always above input (never placeholder-only)
- Error state: `border-red-500` + red helper text below
- Success state (after validation): `border-green-500` subtle
- Disabled: `opacity-50 cursor-not-allowed`
- Focus: `ring-2 ring-brand ring-offset-2`

### Progress Bar

```
<div class="h-2 rounded-full bg-gray-200">
  <div class="h-2 rounded-full bg-green-500" style="width: 42%" />
</div>
```

Color transitions:
- 0–79%: `bg-green-500`
- 80–94%: `bg-amber-500`
- 95–100%: `bg-red-500`

### Toasts

Position: bottom-right (desktop), bottom-center (mobile)
Duration: 4s for info/success, 6s for errors, persistent for critical
Types:
- `default` — neutral info
- `success` — green checkmark
- `destructive` — red error
- `warning` — amber

### Skeleton Loaders

Use `animate-pulse` skeleton blocks instead of spinners for all page-level content loads. Match the skeleton shape to the content it replaces (card-shaped skeletons for cards, line-shaped for text).

### Empty States

Structure: `[Illustration] [Title] [Description] [optional CTA]`
- Illustration: simple SVG, max `120px` tall, muted color
- Title: `text-base font-medium text-foreground`
- Description: `text-sm text-muted-foreground`

---

## 6.6 Icons

Library: `lucide-react` (already in stack)

| Context | Size | Color |
|---------|------|-------|
| Inline with text | `size-4` (16px) | Current text color |
| Card icon | `size-5` (20px) | Muted or brand |
| Empty state | `size-12` (48px) | Muted |
| Status dot | `size-2` (8px) circle | Semantic color |

Common icons:
- Shield → VPN / security
- Activity → usage / connection
- CreditCard → billing
- Download / Copy → config actions
- QrCode → QR modal trigger
- Bell → notifications
- User → profile

---

## 6.7 Motion & Animation

Principles: purposeful, fast, non-distracting.

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Sidebar collapse | 200ms | ease-in-out |
| Modal open | 150ms | ease-out (scale + fade) |
| Sheet slide-in | 250ms | ease-out |
| Toast appear | 200ms | ease-out (slide up) |
| Page transition | 100ms | fade |
| Accordion expand | 200ms | ease-in-out |
| Button loading | Immediate | — |

All animations: `prefers-reduced-motion` media query disables non-essential motion.

---

## 6.8 Dark Mode

- Controlled via `ThemeProvider` (already in codebase)
- All semantic color tokens have dark equivalents
- No hard-coded `text-gray-900` — always use `text-foreground`
- QR codes always render on white background regardless of theme
- Charts use theme-aware grid lines (`border-border`)
- Toggle available in user dropdown (Light / Dark / System)

---

## 6.8 Mobile & Responsive Design

### Breakpoint System

| Name | Range | Sidebar | Content Max-Width | Cards |
|------|-------|---------|------------------|-------|
| `xs` | `< 640px` | Hidden → bottom tab bar | 100% | 1 col |
| `sm` | `640–1023px` | 64px icon-only | 100% | 2 cols |
| `md` | `1024–1279px` | 220px full | 1200px | 2–3 cols |
| `lg` | `≥ 1280px` | 240px full | 1200px | 3 cols |

---

### Bottom Navigation (Mobile)

Replaces the sidebar entirely on `xs`. Fixed at bottom, `56px` tall:

```
┌──────────────────────────────────┐
│ [🏠][⚡][📊][⋯]                  │
│  Home Configs Usage More         │
└──────────────────────────────────┘
```

- Background: `bg-card/95 backdrop-blur-sm` — subtle frosted glass
- Safe area: `pb-safe` (iOS home indicator)
- Active item: brand-colored icon + label + 2px dot indicator above
- Badge support on any tab (unread count, expiry warning)

---

### Touch Target Sizes

| Element | Min Size | Notes |
|---------|---------|-------|
| Button | `44×44px` | WCAG 2.5.5 minimum |
| Icon button | `44×44px` | Use `p-3` around `size-5` icon |
| Table row action | `44px` height | Full-row tappable where possible |
| Form input | `48px` height | Comfortable tap + thumb reach |
| Bottom tab item | Full tab width × `56px` | Generous hit area |
| Checkbox / Radio | `44×44px` inclusive of label | Tap label also toggles |

---

### Typography on Mobile

| Scale | Mobile Size | Desktop Size | Adjustment |
|-------|------------|-------------|-----------|
| Page title | `text-xl` (20px) | `text-2xl` (24px) | `-` |
| Stat number | `text-3xl` (30px) | `text-4xl` (36px) | Smaller to fit card |
| Section heading | `text-base` (16px) | `text-lg` (18px) | `-` |
| Body | `text-sm` (14px) | `text-sm` (14px) | Same |
| Caption | `text-xs` (12px) | `text-xs` (12px) | Same |

- **Input font size: `16px` minimum** on mobile — prevents iOS auto-zoom on focus
- Use `text-base` or `text-sm` for all `<input>` elements regardless of design scale

---

### Spacing Adjustments

| Token | Mobile | Desktop |
|-------|--------|---------|
| Card padding | `p-4` (16px) | `p-6` (24px) |
| Section gap | `gap-4` (16px) | `gap-6` (24px) |
| Page horizontal padding | `px-4` | `px-6` |
| Page top padding | `pt-4` | `pt-6` |

---

### Modals & Overlays on Mobile

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Dialog / Modal | Centered overlay | Bottom sheet |
| Drawer | Slides from right | Slides from bottom |
| Dropdown | Anchored to trigger | Full-width bottom sheet |
| Toast | Bottom-right | Bottom-center, above safe area |
| Tooltip | Hover | Long-press or tap icon |

**Bottom sheet rules:**
- Drag handle: `4×32px`, centered, `bg-muted`, `rounded-full`
- Max height: `90vh`; scrollable inside
- Close: swipe down, tap backdrop, or ✕ button
- Safe area padding at bottom: `pb-safe`
- Keyboard push: sheet slides up when keyboard opens

---

### Form Inputs — Mobile-Specific

```css
/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: 16px;
}

/* Respect safe areas */
.bottom-fixed {
  padding-bottom: env(safe-area-inset-bottom);
}
```

- `inputmode` attributes:
  - Email field: `inputmode="email"`
  - Card number: `inputmode="numeric"`
  - CVV: `inputmode="numeric"`
  - Phone: `inputmode="tel"`
- `autocomplete` attributes set on all auth/payment fields

---

### Horizontal Scroll Containers

For charts and tab rows that overflow on mobile:

```css
.scroll-x {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  /* hide scrollbar on mobile */
  scrollbar-width: none;
}
```

- Scroll hint: fade gradient on right edge (`mask-image: linear-gradient(to right, black 85%, transparent)`)
- No truncation or compression — content maintains its natural size

---

### Image & Asset Optimization

| Asset | Mobile Behavior |
|-------|----------------|
| QR code | Min `220px`, max `min(80vw, 280px)` |
| Empty state illustration | Max `100px` height |
| User avatar | `32px` in topbar, `40px` in sidebar footer |
| Flag emojis | Native emoji — no custom images needed |

---

### Performance Notes

- Skeleton loaders instead of spinners — reduces layout shift on slow connections
- Lazy-load charts (heavy JS) — defer until tab is visible
- Prefetch `/dashboard/configs` and `/dashboard/usage` on dashboard mount (likely next tap)
- Bottom sheet uses `will-change: transform` only during animation, then removed

---

## ۶.۸ پشتیبانی فارسی و RTL — نمای صفحه (Persian / RTL Screen Layout)

### فونت‌ها

| نقش | فونت فارسی | جایگزین |
|-----|-----------|--------|
| متن اصلی | `Vazirmatn` (متغیر) | `IRANSansX` |
| اعداد/کد | `JetBrains Mono` (بدون تغییر) | `Fira Code` |
| بارگذاری فونت | `font-display: swap` برای هر دو | — |

پیکربندی Tailwind:

```js
// tailwind.config.js
fontFamily: {
  sans: ['Inter', 'Vazirmatn', 'system-ui', 'sans-serif'],
}
```

برای صفحات فارسی به‌صورت مستقل `font-family: 'Vazirmatn'` روی `<html dir="rtl">` اعمال می‌شود.

---

### آینه‌سازی طرح‌بندی (Layout Mirroring)

```
حالت LTR (انگلیسی)          حالت RTL (فارسی)
┌──────────────────────┐    ┌──────────────────────┐
│ [Nav] │  Content     │    │  Content     │ [Nav] │
│ Left  │  Right →     │    │  ← Left      │ Right │
└──────────────────────┘    └──────────────────────┘
```

قوانین آینه‌سازی Tailwind:

| کلاس LTR | معادل RTL | توضیح |
|----------|----------|-------|
| `ml-4` | `mr-4` (یا `ms-4`) | فاصله منطقی |
| `pl-6` | `pr-6` (یا `ps-6`) | padding منطقی |
| `left-0` | `right-0` | موقعیت مطلق |
| `border-l` | `border-r` | حاشیه کناری |
| `rounded-l` | `rounded-r` | گوشه‌های گرد |
| `text-left` | `text-right` | تراز متن |

**توصیه:** استفاده از کلاس‌های منطقی Tailwind (`ms-*`, `me-*`, `ps-*`, `pe-*`) به‌جای `ml/mr/pl/pr` برای پشتیبانی خودکار از RTL.

---

### نمای نمونه: کارت کانفیگ

```
LTR                              RTL (فارسی)
┌──────────────────────────┐    ┌──────────────────────────┐
│ 🇩🇪 Frankfurt · VMess    │    │    VMess · فرانکفورت 🇩🇪  │
│ ● Active                 │    │                 فعال ●   │
│ [TLS] [WS]               │    │            [WS] [TLS]    │
│                          │    │                          │
│ [Copy][QR][Download]     │    │  [دانلود][QR][کپی لینک]  │
│ [Details ↓]              │    │          [↓ جزئیات]      │
└──────────────────────────┘    └──────────────────────────┘
```

---

### عناصری که آینه می‌شوند

| عنصر | LTR | RTL |
|------|-----|-----|
| ستون کناری | چپ | راست |
| آیکون نوار اعلان | راست | چپ |
| آیکون نمایش/پنهان رمز | راست فیلد | چپ فیلد |
| دکمه بستن مودال (✕) | راست هدر | چپ هدر |
| نوار پیشرفت | از چپ پر می‌شود | از راست پر می‌شود |
| breadcrumb جداکننده | `/` یا `›` | `›` (معکوس نمی‌شود) |
| آیکون Chevron منو | `›` | `‹` |
| فلش لینک «بیشتر» | `→` | `←` |

---

### عناصری که آینه **نمی‌شوند**

| عنصر | دلیل |
|------|------|
| QR کد | محتوای باینری، بی‌طرف نسبت به جهت |
| نمودارها | محور زمان همیشه از چپ به راست |
| آیکون‌های جهانی (Shield, Bell) | آیکون‌های نمادین، نه جهتی |
| اعداد در URI/UUID | فنی، همیشه LTR |
| فیلدهای ایمیل/پسورد | `dir="ltr"` ثابت |

---

### پیکربندی `<html>` برای حالت فارسی

```html
<html lang="fa" dir="rtl" class="font-vazirmatn">
```

یا با Tailwind:

```jsx
<html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
```

---

### نمونه تایپوگرافی فارسی

| مقیاس | اندازه | وزن | کاربرد |
|-------|--------|-----|--------|
| `text-xs` | ۱۲px | ۴۰۰ | نشان‌ها، زمان‌ها |
| `text-sm` | ۱۴px | ۴۰۰/۵۰۰ | متن اصلی، برچسب‌ها |
| `text-base` | ۱۶px | ۴۰۰ | توضیحات |
| `text-lg` | ۱۸px | ۶۰۰ | عنوان بخش |
| `text-2xl` | ۲۴px | ۷۰۰ | عنوان صفحه |
| `text-4xl` | ۳۶px | ۸۰۰ | اعداد آماری (گیگ مصرف، روز انقضا) |

**فاصله حرفی:** برای فارسی `letter-spacing: 0` — برخلاف انگلیسی که ممکن است tracking اضافه شود.

**ارتفاع خط:** فارسی به فاصله بیشتری نیاز دارد — حداقل `line-height: 1.8` برای `text-sm` و بالاتر.

---

## 6.9 Accessibility Standards

- **WCAG 2.1 AA** minimum
- All interactive elements: visible focus ring (`ring-2 ring-brand`)
- Color is never the sole indicator of state (icons + text accompany colors)
- Minimum touch target: `44×44px` on mobile
- Form errors: programmatically linked via `aria-describedby`
- Images and icons: `aria-hidden` when decorative, `aria-label` when functional
- Keyboard navigable: full tab order, no keyboard traps
- Screen reader tested with VoiceOver (macOS) + NVDA (Windows)

---

## 6.10 Repo Implementation Guidance

### Page Composition In This Codebase

- Dashboard routes should stay thin in `app/` and render a feature page component.
- Feature page composition should live in `features/`.
- Use `components/dashboard/dashboard-page.tsx` as the default page shell for dashboard routes.
- Use `PageSection`, `SectionCard`, `TableSection`, `EmptyState`, and `StatCard` before creating new shared dashboard components.

### Reuse Priority

1. `components/ui/`
2. `components/dashboard/`
3. Feature-local components
4. New shared abstractions only when the pattern is reused across multiple pages

### Frontend-Only Guardrails

- Do not add API clients, server actions, or persistence layers just to satisfy a UI flow.
- Use local state and mock delays for `saving`, `processing`, `sent`, `copied`, `failed`, and similar interaction states.
- Prefer static feature data or files under `mock-data/` for page content.
- If a chart is needed, reuse the existing chart wrapper in `components/ui/chart.ts` unless it is clearly insufficient.

### Form And Table Guidance

- Use existing field primitives in `components/ui/field.ts`, `input.ts`, `select.ts`, `switch.ts`, `textarea.ts`, and `radio-group.ts`.
- Use the existing data table and table-section patterns for inventory-style or history-style views.
- Empty, filtered-empty, loading, and error states are required for every data-heavy page.

### AI Delivery Standard

- When building from these PRDs, AI should implement the page with mocked data, responsive states, and complete interaction feedback before adding polish or new abstraction layers.

### Spec Quality Rules

- When a page uses a table, chart, notification list, or summary cards, the feature doc should provide at least one sample object and at least one empty-state rule.
- When a flow mentions a redirect, send, confirm, refresh, or sync action, the feature doc should clarify whether that action is simulated locally or intentionally deferred.
- When a feature has multiple banners or alerts, the feature doc should define a display priority.
