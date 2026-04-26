# 04 — Payments & Billing

## Purpose

Let users browse plans, complete checkout, renew subscriptions, and view billing history — with clear pricing, no surprise charges, and low-friction payment flows.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/billing` | Billing home — current plan + history |
| `/dashboard/billing/plans` | Plan selection |
| `/dashboard/billing/checkout` | Checkout flow |
| `/dashboard/billing/success` | Post-payment confirmation |
| `/dashboard/billing/invoices` | Invoice list |

---

## 4.1 Billing Home

```
┌────────────────────────────────────────────────────────────┐
│  Billing                                                   │
├────────────────────────────────────────────────────────────┤
│  Current Plan                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Pro]  Pro Plan          $9.99 / month              │  │
│  │  Active · Expires Apr 29, 2026                       │  │
│  │  Auto-renewal: OFF                                   │  │
│  │                                                      │  │
│  │  [Renew Now]  [Change Plan]  [Cancel]                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Billing History                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Apr 1, 2026   Pro · 1 Month   $9.99   [Receipt]   │    │
│  │  Mar 1, 2026   Pro · 1 Month   $9.99   [Receipt]   │    │
│  │  Feb 1, 2026   Pro · 1 Month   $9.99   [Receipt]   │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Current Plan Card

- Plan name + tier badge
- Price per cycle
- Status: `Active`, `Expired`, `Cancelling` (will expire at end of period)
- Expiry date
- Auto-renewal toggle shown as a frontend control for demo purposes
- CTAs change based on state:
  - Active: [Renew / Extend] [Upgrade] [Cancel]
  - Expired: [Renew Now] [Choose Different Plan]
  - No plan: [Get Started →] (sends to plans page)

---

## 4.2 Plan Selection

```
┌────────────────────────────────────────────────────────────┐
│  Choose a Plan                                             │
│  [Monthly]  [3 Months -10%]  [Annual -25%]  ← toggle      │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Free         │ │ Pro ★        │ │ VIP          │       │
│  │              │ │  POPULAR     │ │              │       │
│  │ $0           │ │ $9.99/mo     │ │ $19.99/mo    │       │
│  │              │ │              │ │              │       │
│  │ 5 GB / mo    │ │ 100 GB / mo  │ │ Unlimited    │       │
│  │ 1 config     │ │ 3 configs    │ │ 10 configs   │       │
│  │ 1 device     │ │ 5 devices    │ │ Unlimited    │       │
│  │ Community    │ │ Priority      │ │ Dedicated    │       │
│  │ support      │ │ support      │ │ support      │       │
│  │              │ │              │ │              │       │
│  │  [Get Free]  │ │ [Get Pro]    │ │ [Get VIP]    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                            │
│  ✓ 3-day money-back guarantee · No hidden fees             │
└────────────────────────────────────────────────────────────┘
```

### Plan Card Rules

- Current plan: CTA changes to "Current Plan" (disabled) with a checkmark
- Popular plan: highlighted border + "POPULAR" badge
- Billing cycle toggle: switching cycle recalculates price inline with per-month equivalent shown for multi-month plans ("$7.49/mo billed quarterly")
- On [Get X]: redirects to `/dashboard/billing/checkout?plan=pro&cycle=monthly`

### Feature Comparison Table (below cards)

Expandable "Full comparison →" that shows a full feature matrix table.

---

## 4.3 Checkout

```
┌────────────────────────────────────────────────────────────┐
│  Complete your purchase                                    │
├────────────────────────────────────────────────────────────┤
│  Order Summary                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pro Plan · Monthly                                  │  │
│  │  100 GB · 3 configs · 5 devices                     │  │
│  │  ─────────────────────────────────────              │  │
│  │  Subtotal                                 $9.99      │  │
│  │  Discount (WELCOME10)                    -$1.00      │  │
│  │  ─────────────────────────────────────              │  │
│  │  Total                                   $8.99       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [Promo code input        ] [Apply]                        │
│                                                            │
│  Pay with                                                  │
│  [💰 Wallet]  [💳 Credit/Debit Card]  [₿ Crypto]  [🏦 Bank]│
│  ─────────────────────────────────────────────────────     │
│  Card Number  [                    ]                       │
│  Expiry       [MM/YY]  CVV  [   ]                         │
│  Name on card [                    ]                       │
│                                                            │
│  [   Pay $8.99   ]                                         │
│  🔒 Secure checkout demo · SSL-style trust messaging       │
└────────────────────────────────────────────────────────────┘
```

### Checkout Flow Steps

1. **Plan pre-selected** — user arrives from plan page with plan+cycle in URL params
2. **Promo code** — optional, validates inline with visible feedback
3. **Payment method selection** — tabs: Card · Crypto · Bank Transfer
4. **Submit** — single CTA, amount shown directly on button
5. **Processing** — full overlay: "Processing your payment…" (no double-submission possible)
6. **Success** → navigate to `/dashboard/billing/success`
7. **Failure** → inline error above CTA, form stays filled

### Payment Method Tabs

Tab order: **Wallet** (first, if balance > 0) · Card · Crypto · Bank Transfer.

See `10-wallet.md §10.3` for the full Wallet tab spec (balance display, deduction preview, insufficient-balance CTA). Implement the Wallet tab panel by importing the shared wallet panel from `features/wallet/` — do not duplicate the logic here.

#### Wallet

- Shown as the first tab when `walletBalance > 0`; shown but disabled (badge: "Empty") when `walletBalance === 0`
- Panel behaviour: see [10-wallet.md — §10.3](./10-wallet.md)

#### Credit/Debit Card (default when no wallet balance)
- Card-entry form rendered with local UI fields only
- Real-time card type detection (Visa/MC/Amex icon)
- CVV tooltip explaining what it is

#### Crypto
```
┌────────────────────────────────────────┐
│  Pay with Crypto                       │
│  [Bitcoin]  [USDT]  [ETH]             │
│                                        │
│  Send exactly  0.00023 BTC             │
│  To address:  [1A2b3C…]  [Copy]        │
│                                        │
│  [QR Code]                             │
│                                        │
│  Payment expires in  14:32             │
│  Show pending confirmation state       │
└────────────────────────────────────────┘
```

#### Bank Transfer
- Shows IBAN / account details
- Upload payment receipt button (optional verification)
- Note: manual review, activation within 24h

### Promo Code

- Input + Apply button
- Applied state: green checkmark + discount line in summary
- Invalid code: inline red error "Invalid or expired promo code"
- Only one code at a time

### Error States

| Error | Treatment |
|-------|-----------|
| Card declined | Inline: "Your card was declined. Please check details or use a different card." |
| Insufficient funds | Inline: "Insufficient funds. Try a different payment method." |
| Network error | Toast: "Payment could not be processed. Your card was not charged. Try again." |
| Duplicate charge risk | Show "Your card has NOT been charged" prominently on error |

---

## 4.4 Payment Success

```
┌────────────────────────────────────────┐
│          ✅                            │
│  Payment Successful!                   │
│                                        │
│  Pro Plan · 1 Month                    │
│  Active until May 11, 2026             │
│  Order #TUN-2026-0411-001              │
│                                        │
│  [Go to Dashboard]  [View Receipt]     │
└────────────────────────────────────────┘
```

- Optional auto-navigation to dashboard after 5s (with visible countdown)
- Configs are now accessible — show "Your configs are ready" prompt
- Show receipt confirmation message in the UI

---

## 4.5 Invoice / Receipt

Each invoice is a dedicated page `/dashboard/billing/invoices/{id}`:

```
┌────────────────────────────────────────┐
│  Receipt                   [Download PDF]│
│  Order #TUN-2026-0411-001              │
│  Apr 11, 2026                          │
│  ─────────────────────────────────     │
│  Billed to: sina@example.com           │
│  ─────────────────────────────────     │
│  Pro Plan · Monthly          $9.99     │
│  Discount WELCOME10          -$1.00    │
│  ─────────────────────────────────     │
│  Total paid                  $8.99     │
│  ─────────────────────────────────     │
│  Payment method: Visa ****4242         │
└────────────────────────────────────────┘
```

- Download action may be a frontend placeholder in the first pass
- Print button
- If crypto: shows txid with block explorer link

---

## 4.6 Plan Cancellation Flow

Accessed via "Cancel" on Billing Home. Intentionally not buried, but includes a single friction step:

```
┌────────────────────────────────────────┐
│  Cancel your plan?                     │
│                                        │
│  Your Pro plan will remain active      │
│  until Apr 29, 2026. After that,       │
│  your configs will be disabled.        │
│                                        │
│  Before you go…                        │
│  ○ Too expensive   ○ Didn't use it     │
│  ○ Switching provider  ○ Other         │
│                                        │
│  [Keep My Plan]  [Cancel Plan]         │
└────────────────────────────────────────┘
```

- Radio selection is optional (for internal analytics), not required to cancel
- "Keep My Plan" is the primary CTA (larger, filled)
- "Cancel Plan" is destructive (outline red)
- After cancel: status changes to "Cancelling" on billing page with end date shown

---

---

## نمای فارسی — Screen Layouts (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> **ارز:** نمایش قیمت به تومان یا ریال با جداکننده هزارگان فارسی (مثلاً ۱۲۰٬۰۰۰ تومان)

---

### ۴.۱ خانه صورتحساب (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                            صورتحساب        │
├────────────────────────────────────────────────────────────┤
│                                          پلن فعلی          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           ماهانه / ۱۲۰٬۰۰۰ تومان    پلن حرفه‌ای [Pro]│  │
│  │              ۱۴۰۵/۲/۹ منقضی می‌شود · فعال            │  │
│  │                          تمدید خودکار: خاموش         │  │
│  │                                                      │  │
│  │            [لغو]  [تغییر پلن]  [تمدید کنید]         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│                                      تاریخچه پرداخت        │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [رسید]   ۱۲۰٬۰۰۰ت  ۱ ماه · Pro   ۱۴۰۵/۱/۱۲     │    │
│  │  [رسید]   ۱۲۰٬۰۰۰ت  ۱ ماه · Pro   ۱۴۰۴/۱۲/۱۰    │    │
│  │  [رسید]   ۱۲۰٬۰۰۰ت  ۱ ماه · Pro   ۱۴۰۴/۱۱/۱۱    │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

### ۴.۲ انتخاب پلن (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                        انتخاب پلن          │
│       تبدیل ←  [سالانه ۲۵%-]  [۳ ماهه ۱۰%-]  [ماهانه]   │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │          VIP │ │      ★ Pro   │ │        رایگان│       │
│  │              │ │    محبوب     │ │              │       │
│  │  ۳۵۰٬۰۰۰ت/م │ │  ۱۲۰٬۰۰۰ت/م │ │   ۰ تومان   │       │
│  │              │ │              │ │              │       │
│  │    نامحدود   │ │ ۱۰۰ گیگ/ماه │ │  ۵ گیگ/ماه  │       │
│  │  ۱۰ کانفیگ  │ │  ۳ کانفیگ   │ │  ۱ کانفیگ   │       │
│  │    نامحدود  │ │  ۵ دستگاه   │ │  ۱ دستگاه   │       │
│  │  پشتیبانی   │ │  پشتیبانی   │ │  پشتیبانی   │       │
│  │  اختصاصی    │ │  اولویت‌دار  │ │   عمومی     │       │
│  │              │ │              │ │              │       │
│  │  [خرید VIP]  │ │  [خرید Pro]  │ │  [رایگان]   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                            │
│      بدون هزینه پنهان · ۳ روز ضمانت بازگشت وجه ✓         │
└────────────────────────────────────────────────────────────┘
```

---

### ۴.۳ پرداخت / چک‌اوت (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                       تکمیل خرید           │
├────────────────────────────────────────────────────────────┤
│                                       خلاصه سفارش          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                          ماهانه · پلن حرفه‌ای        │  │
│  │                   ۵ دستگاه · ۳ کانفیگ · ۱۰۰ گیگ    │  │
│  │  ──────────────────────────────────────────────────  │  │
│  │                                 ۱۲۰٬۰۰۰ت    جمع کل  │  │
│  │                               ۱۲٬۰۰۰ت-  (WELCOME10) │  │
│  │  ──────────────────────────────────────────────────  │  │
│  │                                 ۱۰۸٬۰۰۰ت    مجموع   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│         [اعمال]  [         کد تخفیف وارد کنید         ]   │
│                                                            │
│                                        روش پرداخت          │
│   [🏦 کارت به کارت]  [₿ رمزارز]  [💳 کارت بانکی]  [💰 کیف پول]│
│  ─────────────────────────────────────────────────────     │
│                       [              ] شماره کارت          │
│            [   ]  CVV      [MM/YY]       تاریخ انقضا       │
│                       [              ] نام روی کارت         │
│                                                            │
│                  [   پرداخت ۱۰۸٬۰۰۰ تومان   ]             │
│                     رمزگذاری SSL · امن ✓ 🔒               │
└────────────────────────────────────────────────────────────┘
```

---

### ۴.۴ پرداخت موفق (فارسی)

```
┌────────────────────────────────────────┐
│                     ✅                 │
│              پرداخت موفق بود!          │
│                                        │
│             ۱ ماه · پلن حرفه‌ای        │
│          فعال تا ۱۴۰۵/۲/۲۰            │
│         TUN-2026-0411-001 #سفارش       │
│                                        │
│    [مشاهده رسید]  [رفتن به داشبورد]   │
└────────────────────────────────────────┘
```

---

### ۴.۵ رسید / فاکتور (فارسی)

```
┌────────────────────────────────────────┐
│  [دانلود PDF]                  رسید    │
│               TUN-2026-0411-001 #سفارش │
│                       ۱۴۰۵/۱/۲۲       │
│  ───────────────────────────────────   │
│               sina@example.com صدور به │
│  ───────────────────────────────────   │
│        ۱۲۰٬۰۰۰ت       ماهانه · پلن Pro│
│       ۱۲٬۰۰۰ت-          تخفیف WELCOME10│
│  ───────────────────────────────────   │
│        ۱۰۸٬۰۰۰ت             مجموع پرداخت│
│  ───────────────────────────────────   │
│          Visa ****4242   روش پرداخت    │
└────────────────────────────────────────┘
```

---

### ۴.۶ لغو پلن (فارسی)

```
┌────────────────────────────────────────┐
│                    لغو پلن شما؟        │
│                                        │
│   .پلن حرفه‌ای شما تا ۱۴۰۵/۲/۹ فعال   │
│         است، پس از آن کانفیگ‌ها         │
│                   .غیرفعال می‌شوند      │
│                                        │
│                    قبل از رفتن…        │
│  ○ تامین‌کننده را عوض می‌کنم           │
│  ○ استفاده نکردم   ○ گران است           │
│                          ○ سایر        │
│                                        │
│    [لغو پلن]    [نگه داشتن پلن من]    │
└────────────────────────────────────────┘
```

- «نگه داشتن پلن من» دکمه اصلی (پر)
- «لغو پلن» دکمه مخرب (قاب قرمز)

### نکات RTL برای صورتحساب

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| قیمت‌ها | عدد + واحد ارز سمت چپ، برچسب سمت راست |
| تاریخ‌ها | شمسی (۱۴۰۵/۲/۹) |
| جدول تاریخچه | ستون تاریخ سمت راست، مبلغ سمت چپ |
| دکمه «رسید» | سمت چپ هر ردیف |
| نوار تبدیل دوره | ترتیب: ماهانه / ۳ ماهه / سالانه (از راست) |
| تب روش پرداخت | کارت بانکی اول (پیش‌فرض برای بازار ایران) |

---

## 4.7 Renewal Reminder Emails (triggers, not UI)

| Trigger | Email |
|---------|-------|
| 7 days before expiry | "Your plan expires in 7 days" |
| 1 day before expiry | "Your plan expires tomorrow" |
| Day of expiry | "Your plan has expired" |
| Post-expiry +3 days | "Reconnect — renew your plan" |

All emails link back to `/dashboard/billing/plans`.

---

---

## Mobile Layout & Responsive Behavior

### Breakpoints

| Breakpoint | Plan Cards | Checkout | Invoice |
|------------|-----------|---------|---------|
| `< 640px` | Stacked (1 col) | Single column | Single column |
| `640–1023px` | 2-column grid | 2-column (summary + form) | Single column |
| `≥ 1024px` | 3-column grid | 2-column | Centered (600px) |

---

### Billing Home — Mobile

```
┌──────────────────────────┐
│  Billing          320px  │
│  ──────────────────────  │
│  Current Plan            │
│  ┌────────────────────┐  │
│  │ [Pro]  Pro Plan    │  │
│  │ $9.99 / month      │  │
│  │ Active · Apr 29    │  │
│  │ Auto-renewal: OFF  │  │
│  │                    │  │
│  │ [Renew Now]        │  │
│  │ [Change Plan]      │  │
│  │ [Cancel]           │  │
│  └────────────────────┘  │
│  ──────────────────────  │
│  Billing History         │
│  Apr 1  Pro  $9.99 [↗]  │
│  Mar 1  Pro  $9.99 [↗]  │
│  Feb 1  Pro  $9.99 [↗]  │
└──────────────────────────┘
```

- CTAs stack vertically inside the card on mobile
- History rows: date · plan · price · receipt icon (no full "Receipt" text label)
- [↗] receipt link: `44px` tap target

---

### Plan Selection — Mobile

```
┌──────────────────────────┐
│  Choose a Plan           │
│  ──────────────────────  │
│  [Monthly][3 Mo][Annual] │  ← segmented control
│  ──────────────────────  │
│  ┌────────────────────┐  │
│  │  Free              │  │
│  │  $0/mo             │  │
│  │  5 GB · 1 config   │  │
│  │  [Get Free]        │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Pro ★  POPULAR    │  │  ← highlighted border
│  │  $9.99/mo          │  │
│  │  100 GB · 3 configs│  │
│  │  [Get Pro]         │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  VIP               │  │
│  │  $19.99/mo         │  │
│  │  Unlimited         │  │
│  │  [Get VIP]         │  │
│  └────────────────────┘  │
│  ✓ 3-day money-back      │
└──────────────────────────┘
```

- Cards stack full-width, each has a single primary CTA
- Billing cycle toggle: horizontal segmented control (`[Monthly][3 Mo][Annual]`)
- Price updates instantly on toggle with a subtle fade transition
- "Full comparison →" collapses to a link that scrolls to the comparison table below

---

### Checkout — Mobile

Two-step layout on mobile (summary first, then payment form):

**Step 1 — Order Summary:**
```
┌──────────────────────────┐
│  Complete your purchase  │
│  ──────────────────────  │
│  Pro Plan · Monthly      │
│  100 GB · 3 configs      │
│  ──────────────────────  │
│  Subtotal        $9.99   │
│  Discount       -$1.00   │
│  ──────────────────────  │
│  Total           $8.99   │
│  ──────────────────────  │
│  [Promo code   ] [Apply] │
│                          │
│  [Continue to Payment →] │
└──────────────────────────┘
```

**Step 2 — Payment:**
```
┌──────────────────────────┐
│  ← Order Summary         │
│  Pay with                │
│  [💳 Card][₿ Crypto]    │
│  [🏦 Transfer]           │
│  ──────────────────────  │
│  [Card number          ] │
│  [MM/YY   ] [CVV ]       │
│  [Name on card         ] │
│                          │
│  [   Pay $8.99   ]       │
│  🔒 SSL encrypted        │
└──────────────────────────┘
```

- Order summary is collapsible (shows total line only when collapsed)
- "← Order Summary" back link navigates to step 1 without losing form state
- Payment method tabs: scrollable row at `< 360px`
- Card inputs: `font-size: 16px` minimum (prevents iOS auto-zoom on focus)
- Numeric keyboard triggered via `inputmode="numeric"` on card number, CVV, expiry

---

### Crypto Payment — Mobile

```
┌──────────────────────────┐
│  Pay with Crypto         │
│  [Bitcoin][USDT][ETH]    │
│  ──────────────────────  │
│  Send exactly            │
│  0.00023 BTC             │
│                          │
│  ┌──────────────────┐    │
│  │    [QR CODE]     │    │  ← tap to enlarge full-screen
│  └──────────────────┘    │
│                          │
│  [1A2b3C…]  [Copy addr.] │
│                          │
│  Expires in  14:32       │
│  Auto-confirmed          │
└──────────────────────────┘
```

- QR code: tap → full-screen bottom sheet for easy scanning
- Copy address button: `44px` tap target, full-width on `< 375px`

---

### Payment Success — Mobile

```
┌──────────────────────────┐
│                          │
│          ✅              │
│  Payment Successful!     │
│                          │
│  Pro Plan · 1 Month      │
│  Active until May 11     │
│  Order #TUN-0411-001     │
│                          │
│  [  Go to Dashboard  ]   │
│  [  View Receipt     ]   │
│                          │
│  Redirecting in 5s…      │
└──────────────────────────┘
```

- Buttons stack vertically, full-width
- "Redirecting in 5s…" shows countdown below buttons
- No sidebar or bottom nav — clean full-screen success state

---

### Cancellation — Mobile

Cancellation dialog becomes a **bottom sheet** on mobile:

```
┌──────────────────────────┐
│  ────                    │
│  Cancel your plan?       │
│                          │
│  Your Pro plan stays     │
│  active until Apr 29.    │
│                          │
│  ○ Too expensive         │
│  ○ Didn't use it         │
│  ○ Switching provider    │
│  ○ Other                 │
│                          │
│  [Keep My Plan]          │
│  [Cancel Plan]           │
└──────────────────────────┘
```

- Radio options: full-row tap targets (`min-h-[44px]`)
- "Keep My Plan" is the primary (filled) button — full-width
- "Cancel Plan" is destructive outline — full-width below

---

### Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Tap plan card | Scrolls to and highlights card, shows CTA |
| Swipe billing cycle toggle | Switches cycle (same as tapping) |
| Tap payment method tab | Slides form content with transition |
| Tap crypto QR | Opens full-screen bottom sheet |
| Swipe bottom sheet down | Dismisses sheet (cancel/success) |
| Pull-to-refresh on billing home | Refreshes local demo plan + history |

---

## Accessibility & Trust

- Price always shown inclusive of discounts before submit
- "Your card will not be charged" messaging during processing
- SSL badge visible
- No auto-renew without explicit opt-in
- Clear cancellation link (not hidden in footer)

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/billing/page.tsx`
- `app/dashboard/billing/plans/page.tsx`
- `app/dashboard/billing/checkout/page.tsx`
- `app/dashboard/billing/success/page.tsx`
- `app/dashboard/billing/invoices/[id]/page.tsx`
- Feature-local billing UI under `features/billing/`

### Frontend-Only Rules

- No Stripe, crypto processor, bank transfer workflow, invoice generation, or payment submission should be integrated.
- Checkout, promo code, payment method switching, and success/failure flows are all local UI states.
- Receipts and invoices are display pages backed by mock data only.
- Payment method forms may validate format locally but must not submit to any external service.

### Reuse Order

1. Use `DashboardPage`, `PageSection`, `SectionCard`, and `EmptyState` for all billing screens.
2. Reuse existing `components/ui` field controls for forms and toggles.
3. Keep payment-method-specific panels feature-local unless reused elsewhere.

### Required View Models

- Billing home: `currentPlan`, `billingHistory[]`, `autoRenewEnabled`, `status`
- Plans page: `billingCycle`, `plans[]`, `currentPlanId`
- Checkout: `selectedPlan`, `selectedCycle`, `promoState`, `paymentMethod`, `processingState`, `resultState`
- Invoice: `invoice`, `lineItems[]`, `paymentSummary`

### Done Criteria

- Billing UI covers active, expired, no-plan, processing, success, failure, and cancellation-confirmation states.
- Promo codes, credits, and totals update in the UI from local state only.
- Any wording about payment confirmation, receipt delivery, or bank review is treated as display copy, not a real service integration.

### In Scope Now

- Billing home, plan selection, checkout screen states, success screen, invoice display, and cancellation confirmation UI.
- Payment method tabs as interactive frontend panels.

### Out Of Scope Now

- Real payment submission, invoice generation, receipt delivery, PDF generation, bank-transfer review, and crypto confirmation tracking.

### First-Pass Payment Tabs

- Required in first pass: Card, Crypto, Bank Transfer tabs as mocked UI panels.
- Not required in first pass: provider SDKs, wallet integrations, receipt upload handling, or transaction verification.

### Sample Data

```ts
const billingDemo = {
  currentPlan: {
    id: "pro-monthly",
    name: "Pro",
    status: "active",
    priceLabel: "$9.99 / month",
    expiresAtLabel: "Apr 29, 2026",
    autoRenewEnabled: false,
  },
  checkout: {
    selectedPlan: "pro",
    selectedCycle: "monthly",
    paymentMethod: "card",
    promoCode: "WELCOME10",
    subtotal: "$9.99",
    discount: "-$1.00",
    total: "$8.99",
  },
}
```
