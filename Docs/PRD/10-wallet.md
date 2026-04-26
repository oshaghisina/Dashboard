# 10 — Wallet

## Purpose

Give every user a personal wallet that holds a pre-loaded balance. The wallet appears as a payment method tab alongside Card, Crypto, and Bank Transfer at checkout. Users top up their wallet separately and can spend the balance on any plan purchase or config charge without re-entering payment details each time.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/billing/wallet` | Wallet home — balance card + transaction history |
| `/dashboard/billing/wallet/topup` | Top-up flow |

---

## 10.1 Wallet Home

```
┌────────────────────────────────────────────────────────────┐
│  Wallet                                                    │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Available Balance                                   │  │
│  │  ۱۲۰٬۰۰۰ ت                                           │  │
│  │  Last topped up: Apr 20, 2026                        │  │
│  │                                                      │  │
│  │  [+ Top Up Wallet]                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Transaction History                            [Filter ▾] │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Apr 22  Config Charge · Frankfurt    -۳۰٬۰۰۰ت     │    │
│  │  Apr 20  Deposit · Bank Transfer     +۲۰۰٬۰۰۰ت     │    │
│  │  Apr 15  Plan Purchase · Pro 1 Month  -۱۲۰٬۰۰۰ت    │    │
│  │  Apr 10  Deposit · Crypto (USDT)     +۵۰۰٬۰۰۰ت     │    │
│  └────────────────────────────────────────────────────┘    │
│  [Load more]                                               │
└────────────────────────────────────────────────────────────┘
```

### Balance Card

- Balance displayed in the user's currency (Toman for Iran locale, USD otherwise)
- "Last topped up" date from mock data — shown as a trust signal
- `[+ Top Up Wallet]` is the single primary CTA, links to `/dashboard/billing/wallet/topup`
- Low balance warning: if balance < 20,000 ت, replace the subtitle with an amber banner: "Low balance — top up to avoid service interruption"
- Zero balance: balance shows `۰ ت` and the banner reads "No balance — top up to purchase plans or configs"

### Transaction History Table

| Column | Description |
|--------|-------------|
| Date | Shamsi for fa locale, Gregorian otherwise |
| Description | Transaction label (see type labels below) |
| Amount | Green `+` for credits, red `−` for debits |

**Transaction type labels:**

| Type | Label example |
|------|---------------|
| `deposit` | Deposit · Bank Transfer / Deposit · Crypto (USDT) / Deposit · Card |
| `plan_purchase` | Plan Purchase · Pro 1 Month |
| `config_charge` | Config Charge · Frankfurt |
| `representative_deduction` | Rep Charge · User: Ali R. |
| `refund` | Refund · Plan Cancellation |

- Filter dropdown: All · Deposits · Purchases · Charges · Refunds
- Empty state (no transactions): "No transactions yet. Top up your wallet to get started."

---

## 10.2 Top-Up Flow

Accessed via `[+ Top Up Wallet]` or the low-balance banner CTA.

```
┌────────────────────────────────────────────────────────────┐
│  Top Up Wallet                                             │
├────────────────────────────────────────────────────────────┤
│  Amount                                                    │
│  [۵۰٬۰۰۰] [۱۰۰٬۰۰۰] [۲۰۰٬۰۰۰] [۵۰۰٬۰۰۰]  ← quick pick │
│  Or enter custom amount: [            ]                    │
│                                                            │
│  Pay with                                                  │
│  [💳 Card]  [₿ Crypto]  [🏦 Bank Transfer]                │
│  ─────────────────────────────────────────────────────     │
│  (payment method panel — same as billing checkout tabs)    │
│                                                            │
│  [   Add ۱۰۰٬۰۰۰ت to Wallet   ]                           │
│  🔒 Secure · balance added instantly after confirmation    │
└────────────────────────────────────────────────────────────┘
```

### Amount Selection

- Four quick-pick preset buttons; selecting one highlights it and populates the custom field
- Custom amount field: numeric, min 10,000 ت, max 10,000,000 ت — validated inline
- CTA label updates live: "Add ۱۰۰٬۰۰۰ت to Wallet"

### Payment Method Tabs

Reuse the same three panels from billing checkout (04-payments.md §4.3):
- **Card** — card entry fields
- **Crypto** — coin selector + address + QR + countdown
- **Bank Transfer** — account details + receipt upload

After confirming payment, simulate a processing overlay then redirect back to `/dashboard/billing/wallet` with the new balance reflected and a success toast: "۱۰۰٬۰۰۰ت added to your wallet."

### Error States

| Error | Treatment |
|-------|-----------|
| Amount below minimum | Inline: "Minimum top-up is ۱۰٬۰۰۰ت" |
| Amount above maximum | Inline: "Maximum single top-up is ۱۰٬۰۰۰٬۰۰۰ت" |
| Payment failed | Inline above CTA: "Payment failed. Your wallet was not charged." |
| Network error | Toast: "Something went wrong. Please try again." |

---

## 10.3 Wallet as a Payment Method at Checkout

When the user reaches `/dashboard/billing/checkout` or a representative charges a config, a **Wallet** tab appears as the first payment option if the user has a wallet with any balance.

```
│  Pay with                                                  │
│  [💰 Wallet ۱۲۰٬۰۰۰ت]  [💳 Card]  [₿ Crypto]  [🏦 Bank] │
│  ─────────────────────────────────────────────────────     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Your wallet balance                  ۱۲۰٬۰۰۰ت      │  │
│  │  Order total                          -۱۰۸٬۰۰۰ت     │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │  Remaining after payment               ۱۲٬۰۰۰ت      │  │
│  │                                                      │  │
│  │  [   Pay ۱۰۸٬۰۰۰ت from Wallet   ]                   │  │
│  └──────────────────────────────────────────────────────┘  │
```

- If balance ≥ order total: show balance, deduction, and remaining — CTA is enabled
- If balance < order total: show balance + shortfall, CTA is replaced with: "Insufficient balance — [Top Up ۶٬۰۰۰ت] to proceed" (link opens top-up flow in a sheet)
- If wallet balance is zero: Wallet tab is shown but disabled with a badge "Empty" — tab is not hidden so users know the feature exists
- After wallet payment: deduct from balance in local state and navigate to success page as normal

---

## نمای فارسی — Screen Layouts (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> **ارز:** تومان با جداکننده هزارگان فارسی (مثلاً ۱۲۰٬۰۰۰ت)
> **تاریخ:** شمسی

---

### ۱۰.۱ خانه کیف پول (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                                کیف پول     │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                    موجودی کیف پول    │  │
│  │                                        ۱۲۰٬۰۰۰ ت    │  │
│  │                  آخرین شارژ: ۱۴۰۵/۲/۱              │  │
│  │                                                      │  │
│  │                           [شارژ کیف پول +]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [▾ فیلتر]                            تاریخچه تراکنش‌ها   │
│  ┌────────────────────────────────────────────────────┐    │
│  │   ۳۰٬۰۰۰ت-   شارژ کانفیگ · فرانکفورت  ۱۴۰۵/۲/۲  │    │
│  │  ۲۰۰٬۰۰۰ت+      واریز · کارت به کارت  ۱۴۰۵/۱/۳۱  │    │
│  │  ۱۲۰٬۰۰۰ت-  خرید پلن · حرفه‌ای ۱ ماه  ۱۴۰۵/۱/۲۶  │    │
│  │  ۵۰۰٬۰۰۰ت+      واریز · رمزارز (USDT) ۱۴۰۵/۱/۲۱  │    │
│  └────────────────────────────────────────────────────┘    │
│                                            [بارگذاری بیشتر]│
└────────────────────────────────────────────────────────────┘
```

---

### ۱۰.۲ شارژ کیف پول (فارسی)

```
┌────────────────────────────────────────────────────────────┐
│                                          شارژ کیف پول     │
├────────────────────────────────────────────────────────────┤
│                                                    مبلغ    │
│    [۵۰۰٬۰۰۰] [۲۰۰٬۰۰۰] [۱۰۰٬۰۰۰] [۵۰٬۰۰۰]              │
│                      [              ] :یا مبلغ دلخواه     │
│                                                            │
│                                          روش پرداخت        │
│          [🏦 کارت به کارت]  [₿ رمزارز]  [💳 کارت بانکی]  │
│                                                            │
│               [   افزودن ۱۰۰٬۰۰۰ت به کیف پول   ]         │
│                   موجودی فوری پس از تأیید · امن 🔒        │
└────────────────────────────────────────────────────────────┘
```

---

### ۱۰.۳ پرداخت با کیف پول در چک‌اوت (فارسی)

```
│                                              روش پرداخت   │
│  [🏦 کارت به کارت]  [₿ رمزارز]  [💳 کارت]  [💰 کیف پول] │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                       ۱۲۰٬۰۰۰ت    موجودی کیف پول   │  │
│  │                      ۱۰۸٬۰۰۰ت-          مبلغ سفارش  │  │
│  │  ──────────────────────────────────────────────────  │  │
│  │                        ۱۲٬۰۰۰ت    مانده پس از پرداخت│  │
│  │                                                      │  │
│  │         [   پرداخت ۱۰۸٬۰۰۰ت از کیف پول   ]         │  │
│  └──────────────────────────────────────────────────────┘  │
```

---

## Mobile Layout & Responsive Behavior

### Wallet Home — Mobile

```
┌──────────────────────────┐
│  Wallet            320px │
│  ──────────────────────  │
│  ┌────────────────────┐  │
│  │  Available Balance │  │
│  │  ۱۲۰٬۰۰۰ت         │  │
│  │  Last topped up    │  │
│  │  Apr 20, 2026      │  │
│  │  [+ Top Up Wallet] │  │
│  └────────────────────┘  │
│  ──────────────────────  │
│  Transactions  [Filter]  │
│  Apr 22 Config  -۳۰٬۰۰۰  │
│  Apr 20 Deposit +۲۰۰٬۰۰۰ │
│  Apr 15 Plan   -۱۲۰٬۰۰۰  │
│  [Load more]             │
└──────────────────────────┘
```

- Balance card full-width, centered balance text
- Transaction rows: date · short label · amount — single line
- Filter button: top-right of the section header, opens a bottom sheet picker
- Low balance banner: full-width amber strip above the balance card

### Top-Up — Mobile

- Quick-pick presets: 2×2 grid of buttons
- Custom amount input: full-width below grid
- Payment method tabs: horizontally scrollable row
- CTA: full-width sticky button pinned above bottom safe area

### Breakpoints

| Breakpoint | Balance card | Transactions | Top-up amounts |
|------------|-------------|--------------|----------------|
| `< 640px` | Full-width | Single column | 2×2 grid |
| `640–1023px` | Centered (480px) | Single column | 4-column row |
| `≥ 1024px` | Left column with history on right | Two-column layout | 4-column row |

---

## Frontend Build Notes

### Implementation Targets

- `app/dashboard/billing/wallet/page.tsx`
- `app/dashboard/billing/wallet/topup/page.tsx`
- Feature UI under `features/wallet/`

### Frontend-Only Rules

- No real payment processor or balance ledger — all state is local mock data
- Top-up flow reuses the same payment tab components from `features/billing/` (do not duplicate)
- Balance and transaction list come from a static mock object in `features/wallet/`
- Wallet tab in checkout is added to the existing payment method tab group in `features/billing/` — keep it feature-local, no new shared abstraction

### Required View Models

- Wallet home: `balance`, `currency`, `lastToppedUp`, `transactions[]`, `filterState`
- Top-up: `selectedAmount`, `customAmount`, `paymentMethod`, `processingState`
- Checkout wallet tab: `walletBalance`, `orderTotal`, `remaining`, `sufficientFunds`

### Done Criteria

- Wallet home shows balance card and transaction history with filter working in local state
- Top-up flow covers amount selection, three payment tabs, processing overlay, and success redirect
- Wallet tab appears in checkout and correctly computes remaining / shows shortfall CTA
- All four states covered: sufficient balance, insufficient balance, zero balance, top-up in progress

### In Scope Now

- Wallet home, top-up flow, wallet payment tab in checkout

### Out Of Scope Now

- Auto top-up toggle, real balance sync, push alerts for low balance, server-side ledger

### Sample Data

```ts
const walletDemo = {
  balance: 120_000,
  currency: "IRR",
  lastToppedUp: "2026-04-20",
  transactions: [
    { id: "w-04", date: "2026-04-22", type: "config_charge", label: "Config Charge · Frankfurt",    amount: -30_000 },
    { id: "w-03", date: "2026-04-20", type: "deposit",       label: "Deposit · Bank Transfer",      amount: +200_000 },
    { id: "w-02", date: "2026-04-15", type: "plan_purchase", label: "Plan Purchase · Pro 1 Month",  amount: -120_000 },
    { id: "w-01", date: "2026-04-10", type: "deposit",       label: "Deposit · Crypto (USDT)",      amount: +500_000 },
  ],
}
```
