# 08 — Referral System

## Purpose

Every user receives a unique referral code at account creation. New users are encouraged (but not required) to enter a referral code during signup. Both referrer and referee receive a defined reward when the referee completes their first paid plan.

---

## User Stories

| # | As a… | I want to… | So that… |
|---|-------|-----------|---------|
| US-1 | Existing user | Share my referral code/link with friends | They can get a discount and I earn a reward |
| US-2 | New user | Enter a referral code at signup | I receive a discount on my first plan |
| US-3 | Existing user | See how many people I've referred | I can track my rewards |
| US-4 | Existing user | Know when a referral converts (pays) | I'm notified and can see the reward |
| US-5 | New user arriving via referral link | Have the code pre-filled at signup | I don't have to manually type it |
| US-6 | Admin | View top referrers and program performance | I can monitor abuse and ROI |

---

## Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/referral` | Referral home — code, share links, stats |
| `/signup?ref=ABC123` | Signup with pre-filled referral code |

---

## 8.1 Referral Code Generation

- For frontend work, assume each user already has a referral code available in mock data
- Format: `6–8 alphanumeric, uppercase` — e.g., `SINA42`, `TUN8KX`
- Permanent for display purposes in the first frontend pass
- Displayed on the referral dashboard and accepted as input on signup screens

---

## 8.2 Signup Flow — With Referral Code

### Entry Points

1. **Direct URL:** `/signup?ref=SINA42` — code pre-filled and locked
2. **Referral landing page:** `/join/SINA42` — branded page with referrer name/avatar + CTA
3. **Manual entry:** standard `/signup` — optional referral field, collapsed by default

---

### Screen Layout — Signup with Pre-filled Code

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  You were invited by Sina           │
│  🎁 You'll get 20% off your         │
│     first plan                      │
│                                     │
│  Create your account                │
│  Already have one? Sign in →        │
│                                     │
│  [Email input          ]            │
│  [Password input       ] [👁]       │
│  [Confirm password     ] [👁]       │
│                                     │
│  Referral code                      │
│  [SINA42              ] ✓ Applied   │
│                                     │
│  [     Create Account     ]         │
│                                     │
│  ──────── or continue with ──────── │
│  [G Google]  [GH GitHub]            │
│                                     │
│  By signing up you agree to         │
│  Terms · Privacy Policy             │
└─────────────────────────────────────┘
```

- Referrer name + avatar (if available) shown at top — social proof
- Reward banner: `🎁 You'll get 20% off your first plan`
- Referral code field: pre-filled + read-only (locked, green ✓)
- If user clears the field, it becomes editable and reward banner disappears

---

### Screen Layout — Signup without Referral Code (Manual Entry)

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  Create your account                │
│  Already have one? Sign in →        │
│                                     │
│  [Email input          ]            │
│  [Password input       ] [👁]       │
│  [Confirm password     ] [👁]       │
│                                     │
│  Have a referral code?  [+ Add]     │
│                                     │
│  [     Create Account     ]         │
│  ...                                │
└─────────────────────────────────────┘
```

Tapping `[+ Add]` expands inline:

```
│  Referral code (optional)           │
│  [                    ]             │
│  [Apply]                            │
```

- On valid code: green ✓, reward banner appears above form
- On invalid code: inline error "This referral code isn't valid."
- Field collapses again via `[Remove]` link

---

### Referral Code Field — States

| State | Visual |
|-------|--------|
| Empty / collapsed | "Have a referral code? [+ Add]" link |
| Expanded, empty | Input + [Apply] button |
| Typing | No validation until [Apply] or blur |
| Valid | Green border + ✓ icon + reward badge shown |
| Invalid | Red border + "This code isn't valid." |
| Pre-filled (from URL) | Read-only, green ✓, not removable |
| Pre-filled (from URL), cleared by user | Editable, reward badge hidden |

---

### Referral Landing Page (`/join/SINA42`)

A lightweight branded page before the signup form, for link-sharing contexts (social media, messaging):

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  [Avatar]  Sina invites you         │
│            to Tunnel                │
│                                     │
│  🔒 Fast, secure VPN               │
│  🎁 20% off your first month       │
│  ✅ 3-day money-back guarantee      │
│                                     │
│  [  Create Account  ]               │
│  Already have one? Sign in          │
└─────────────────────────────────────┘
```

- CTA links to `/signup?ref=SINA42`
- Referrer name pulled from their public profile (first name only)
- Avatar: initials fallback if no photo
- Page is publicly accessible (no auth required)

---

## 8.3 Referral Dashboard (`/dashboard/referral`)

### Screen Layout — Desktop

```
┌────────────────────────────────────────────────────────────────┐
│  Referral Program                                              │
├────────────────────────────────────────────────────────────────┤
│  Your referral code                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SINA42                         [Copy Code]  [Copy Link] │  │
│  │                                                          │  │
│  │  Share:  [💬 WhatsApp] [📱 Telegram] [✉ Email] [🔗 Copy]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  Referred    │ │  Converted   │ │  Earned      │           │
│  │  12          │ │  7           │ │  $14.00      │           │
│  │  signups     │ │  paid plans  │ │  in rewards  │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                │
│  How it works                                                  │
│  1. Share your code with friends                               │
│  2. They sign up and get 20% off                               │
│  3. When they pay, you earn $2 credit                          │
│                                                                │
│  Referral History                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Apr 10  a***@gmail.com   Signed up    —               │    │
│  │  Apr 8   b***@yahoo.com   Paid  Pro    +$2.00  ✓       │    │
│  │  Mar 31  c***@email.com   Paid  VIP    +$2.00  ✓       │    │
│  │  Mar 20  d***@email.com   Signed up    Pending         │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

---

### Components

#### Referral Code Card

- Large monospace code display: `text-2xl font-mono tracking-widest`
- [Copy Code] — copies bare code to clipboard
- [Copy Link] — copies `https://tunnel.app/join/SINA42`
- Share buttons: direct deep links to WhatsApp, Telegram, Email (pre-filled message), generic copy

#### Stat Cards

| Card | Metric |
|------|--------|
| Referred | Total unique signups via this code |
| Converted | Signups who completed a paid plan |
| Earned | Total reward credits accumulated |

#### How It Works — Inline Explainer

3-step horizontal list (desktop) / vertical (mobile). Always visible — no collapse.

#### Referral History Table

| Column | Content |
|--------|---------|
| Date | When the event happened |
| User | Masked email (`a***@gmail.com`) |
| Status | `Signed up` / `Paid` / `Pending` |
| Plan | Plan purchased (if converted) |
| Reward | Amount earned (`+$2.00`) or `—` |
| Badge | ✓ Confirmed / ⏳ Pending |

- Privacy: referred users shown with masked emails only
- Rows are read-only, no actions
- Paginated: 20 per page

---

### Reward States

| Status | Meaning | Visual |
|--------|---------|--------|
| Signed up | Referee created account, no purchase yet | Gray "Signed up" badge |
| Pending | Referee made first payment, reward processing | Amber ⏳ badge |
| Confirmed | Reward credited to referrer's account | Green ✓ badge + `+$2.00` |
| Expired | Referee never purchased within 90 days | Muted "Expired" badge |

---

## 8.4 Reward Mechanics

> Reward amounts are configurable by admin — these are placeholder values for design purposes.

| Event | Referrer Gets | Referee Gets |
|-------|--------------|-------------|
| Referee signs up | Nothing (yet) | Nothing (yet) |
| Referee completes first paid plan | $2.00 account credit | 20% off first plan |
| Reward credited | In-app notification + email | — |

- Credits applied automatically to referrer's next payment
- Credits never expire
- Referral is only counted once per referee (one account per email)
- Self-referral is blocked (user cannot use their own code)

---

## 8.5 States & Edge Cases

| Scenario | Behavior |
|----------|----------|
| User tries own code at signup | Inline error: "You can't use your own referral code." |
| Code from deactivated account | Code still valid — rewards are still paid |
| Referee pays, then refunds | Reward is reversed from referrer's balance |
| User has $0 credits at checkout | Credits not shown in checkout summary |
| User has credits at checkout | Credit line shown in order summary, auto-applied |
| Code entered after OAuth signup | Code can be entered via profile settings within 24h of signup |

---

## 8.6 Credit Application at Checkout

When a referrer has credit balance, it appears in the checkout order summary:

```
┌──────────────────────────────────────────┐
│  Pro Plan · Monthly                      │
│  ──────────────────────────────────────  │
│  Subtotal                      $9.99     │
│  Referral credit               -$2.00    │
│  ──────────────────────────────────────  │
│  Total                         $7.99     │
└──────────────────────────────────────────┘
```

- Applied automatically — no user action required
- If credit > total, remainder carries forward (no negative charge)
- Shown as a distinct line (different from promo code discount)

---

## Mobile Layout

### Referral Dashboard — Mobile

```
┌──────────────────────────┐
│  Referral Program        │
│  ──────────────────────  │
│  Your code               │
│  ┌────────────────────┐  │
│  │  SINA42            │  │
│  │  [Copy Code]       │  │
│  │  [Copy Link]       │  │
│  └────────────────────┘  │
│                          │
│  Share via               │
│  [💬][📱][✉][🔗]         │
│  ──────────────────────  │
│  ┌──────┐┌──────┐┌──────┐│
│  │  12  ││  7   ││  $14 ││
│  │signups││paid ││earned││
│  └──────┘└──────┘└──────┘│
│  ──────────────────────  │
│  How it works            │
│  1. Share your code      │
│  2. Friend gets 20% off  │
│  3. You earn $2 credit   │
│  ──────────────────────  │
│  History                 │
│  Apr 10  a***  Signed up │
│  Apr 8   b***  +$2 ✓     │
│  [Load more]             │
└──────────────────────────┘
```

- Code card: full-width, `Copy Code` and `Copy Link` stack vertically
- Share buttons: icon-only row, `44×44px` each
- Stat cards: 3-column compact grid
- History rows: condensed (date + masked email + status/reward on one line)

### Signup with Code — Mobile

```
┌──────────────────────────┐
│  [Logo]                  │
│  ──────────────────────  │
│  [Avatar] Sina invites   │
│  you · 🎁 20% off        │
│  ──────────────────────  │
│  Create your account     │
│  Have one? Sign in →     │
│                          │
│  [Email               ]  │
│  [Password          👁]  │
│  [Confirm           👁]  │
│                          │
│  Referral code           │
│  [SINA42          ] ✓   │
│                          │
│  [   Create Account   ]  │
└──────────────────────────┘
```

- Reward banner collapses to a single badge line on `< 375px`
- Referral field: full-width, same size as other inputs

---

## Persian / RTL Screen Layout (نمای فارسی)

### صفحه دعوت — ثبت‌نام با کد معرف

```
┌─────────────────────────────────────┐
│                             [لوگو]  │
│                                     │
│              سینا شما را دعوت کرد  │
│    [آواتار]                         │
│          🎁 ۲۰٪ تخفیف در اولین پلن │
│                                     │
│                ساخت حساب کاربری     │
│         ← وارد شوید  حساب دارید؟   │
│                                     │
│            [        ورودی ایمیل ]   │
│      [👁]  [      ورودی رمز عبور ]  │
│      [👁]  [    تکرار رمز عبور  ]   │
│                                     │
│                      کد معرف        │
│           ✓  [             ۴۲انیس ] │
│                                     │
│          [    ساخت حساب کاربری    ] │
└─────────────────────────────────────┘
```

### داشبورد معرفی (فارسی)

```
┌────────────────────────────────────────────────────────────────┐
│                                         برنامه معرفی دوستان    │
├────────────────────────────────────────────────────────────────┤
│                                            کد معرفی شما        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [کپی لینک]  [کپی کد]                        ۴۲انیس     │  │
│  │                                                          │  │
│  │  [🔗 کپی] [✉ ایمیل] [📱 تلگرام] [💬 واتساپ]    اشتراک  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  درآمد      │ │  تبدیل شده  │ │  معرفی شده  │           │
│  │  ۱۴۰٬۰۰۰ت  │ │  ۷ نفر      │ │  ۱۲ نفر     │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                │
│                                          نحوه کار              │
│              کد خود را با دوستانتان به اشتراک بگذارید .۱      │
│                     آن‌ها ۲۰٪ تخفیف در اولین پلن می‌گیرند .۲  │
│                     وقتی پرداخت کنند شما ۲۰٬۰۰۰ت دریافتی .۳  │
│                                                                │
│                                          تاریخچه معرفی         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ✓  +۲۰٬۰۰۰ت    Pro    پرداخت    b***@yahoo.com  ۱۴۰۵/۱/۱۹│  │
│  │  ⏳ در انتظار    —      ثبت‌نام   a***@gmail.com  ۱۴۰۵/۱/۲۱│  │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

### نکات RTL برای سیستم معرفی

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| نمایش کد | فونت مونواسپیس، `dir="ltr"` (کد فنی است) |
| دکمه‌های اشتراک | از راست به چپ: واتساپ / تلگرام / ایمیل / کپی |
| جدول تاریخچه | تاریخ سمت راست، جایزه سمت چپ |
| نشان وضعیت | سمت چپ ردیف |
| مراحل «نحوه کار» | شماره‌گذاری فارسی (۱، ۲، ۳)، راست‌چین |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/referral/page.tsx`
- `features/referral/referral-page.tsx`
- Optional share helpers or history helpers under `features/referral/`
- Mock referral data in `mock-data/` or feature-local data files

### Reuse Order

1. Use `DashboardPage` for the route shell.
2. Use `PageSection` for the code/share area, summary cards, explainer, and history.
3. Use `StatCard` for the three summary metrics.
4. Use `TableSection` for referral history if the table pattern fits; otherwise keep a feature-local history list.
5. Use `EmptyState` when there are no referrals yet.

### Frontend-Only Rules

- Referral code generation, reward processing, and conversion logic are represented as mock states only.
- `Copy Code`, `Copy Link`, and share actions are client-side interactions with toast or inline success feedback.
- Signup referral states should be coordinated with the auth screens in `01-auth.md`, but no real referral validation service should be added.
- Landing-page, dashboard, and signup-with-code states all read from local mock data only.

### Required View Model

- `referralCode`
- `referralLink`
- `referrerName`
- `referrerAvatar`
- `summary.referredCount`
- `summary.convertedCount`
- `summary.earnedAmount`
- `summary.currencyLabel`
- `history[]`
- `history[i].dateLabel`
- `history[i].emailMasked`
- `history[i].status`
- `history[i].plan`
- `history[i].rewardAmount`
- `history[i].rewardState`

### Required States

- Populated dashboard
- Zero-referrals empty state
- Copy success state
- Share action state
- Pending reward state
- Confirmed reward state
- Reversed or refunded reward state
- Signup screen with valid code
- Signup screen with invalid code

### Done Criteria

- The referral dashboard renders fully from mock data with working local interactions.
- Code card, summary cards, explainer, and history all match the dashboard component patterns already used in this repo.
- Empty, populated, and reward-status variants are implemented without backend logic.

### In Scope Now

- Referral dashboard, landing page, signup-with-code states, share buttons, reward states, and empty-state handling.

### Out Of Scope Now

- Real code validation, reward accounting, share analytics, referral abuse checks, and syncing referral state across authenticated sessions.

### Share Copy

- WhatsApp: `Join Tunnel with my referral code SINA42 and get 20% off your first plan: https://tunnel.app/join/SINA42`
- Telegram: `Use my Tunnel referral code SINA42 for 20% off your first plan: https://tunnel.app/join/SINA42`
- Email subject: `Try Tunnel with my referral code`
- Email body: `Use my referral code SINA42 when you sign up for Tunnel and get 20% off your first plan: https://tunnel.app/join/SINA42`

### Sample Data

```ts
const referralDemo = {
	referralCode: "SINA42",
	referralLink: "https://tunnel.app/join/SINA42",
	referrerName: "Sina",
	referrerAvatar: null,
	summary: {
		referredCount: 12,
		convertedCount: 7,
		earnedAmount: "$14.00",
		currencyLabel: "USD",
	},
	history: [
		{
			id: "r1",
			dateLabel: "Apr 10",
			emailMasked: "a***@gmail.com",
			status: "Signed up",
			plan: null,
			rewardAmount: null,
			rewardState: "pending",
		},
		{
			id: "r2",
			dateLabel: "Apr 8",
			emailMasked: "b***@yahoo.com",
			status: "Paid",
			plan: "Pro",
			rewardAmount: "+$2.00",
			rewardState: "confirmed",
		},
	],
}
```
