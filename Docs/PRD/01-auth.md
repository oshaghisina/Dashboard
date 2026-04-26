# 01 — Authentication & Onboarding

## Purpose

Allow users to create an account, sign in securely, and recover access — with minimal friction and clear error feedback at every step.

---

## Flows

### 1.1 Sign Up

**Entry Points:** Marketing site CTA → `/signup`, referral link `/signup?ref=CODE`, referral landing page `/join/CODE`

**Screen Layout — Standard**

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
│  [     Create Account     ] ←CTA    │
│                                     │
│  ──────── or continue with ──────── │
│  [G Google]  [GH GitHub]            │
│                                     │
│  By signing up you agree to         │
│  Terms · Privacy Policy             │
└─────────────────────────────────────┘
```

**Screen Layout — With Referral Code (via `/signup?ref=SINA42`)**

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  [Avatar]  Sina invites you         │
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
│  [SINA42              ] ✓           │
│                                     │
│  [     Create Account     ] ←CTA    │
│                                     │
│  ──────── or continue with ──────── │
│  [G Google]  [GH GitHub]            │
│                                     │
│  By signing up you agree to         │
│  Terms · Privacy Policy             │
└─────────────────────────────────────┘
```

**Field Rules**
- Email: real-time format validation on blur
- Password: min 8 chars, show strength meter (weak / fair / strong) inline below field
- Confirm password: validate equality on blur only, not on every keystroke
- Referral code: optional, collapsed by default; pre-filled + locked when arriving via referral URL; validated on [Apply] or form submit

**Referral Code Field States**

| State | Visual |
|-------|--------|
| Collapsed | "Have a referral code? [+ Add]" text link |
| Expanded, empty | Input + [Apply] button |
| Valid code | Green border + ✓ icon; reward banner appears above form |
| Invalid code | Red border + "This code isn't valid." inline error |
| Pre-filled from URL | Read-only input, green ✓, reward banner always shown |
| Own code entered | Red error: "You can't use your own referral code." |

**States**

| State | Behavior |
|-------|----------|
| Default | Fields empty, referral field collapsed, CTA enabled |
| Typing | Inline validation on blur |
| Submitting | CTA shows spinner + "Creating account…", all inputs disabled |
| Success | Redirect to `/verify-email` with email masked (`j***@gmail.com`) |
| Error — email taken | Inline error under email field: "An account with this email exists. [Sign in →]" |
| Error — server | Toast (destructive): "Something went wrong. Try again." |

---

### 1.2 Email Verification

**Screen Layout**

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  Check your inbox                   │
│  We sent a link to j***@gmail.com   │
│                                     │
│  [  Open Gmail  ]  ← smart link     │
│                                     │
│  Didn't receive it?                 │
│  [Resend email] · Use different     │
│  email                              │
│                                     │
│  Link expires in 24 hours           │
└─────────────────────────────────────┘
```

**Interactions**
- "Open Gmail" / "Open Outlook" button auto-detected via email domain
- Resend CTA disabled for 60s after first send — shows countdown: "Resend in 45s"
- On clicking verification link: brief loading overlay → redirect to `/dashboard` with welcome toast

---

### 1.3 Sign In

**Entry Points:** `/login`, expired session redirect, post-payment redirect

**Screen Layout**

```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│  Welcome back                       │
│  Don't have an account? Sign up →   │
│                                     │
│  [Email input          ]            │
│  [Password input       ] [👁]       │
│                                     │
│  [     Sign In     ]                │
│                                     │
│  Forgot password?                   │
│                                     │
│  ──────── or continue with ──────── │
│  [G Google]  [GH GitHub]            │
└─────────────────────────────────────┘
```

**States**

| State | Behavior |
|-------|----------|
| Submitting | CTA spinner, inputs locked |
| Wrong credentials | Inline error: "Email or password is incorrect" — do NOT say which is wrong |
| Account locked (5 failed) | Error banner: "Too many attempts. Try again in 15 min or reset your password." |
| Unverified email | Error with action: "Please verify your email first. [Resend verification →]" |
| Success | Redirect to `/dashboard` or original deep-link destination |

**Security Notes**
- Rate-limit: 5 attempts / 15 min per IP + per email
- No indication of whether an email exists on failed login (prevents enumeration)
- Remember session via httpOnly cookie, 30-day sliding expiry

---

### 1.4 Forgot Password

**Step 1 — Request Reset**

```
┌─────────────────────────────────────┐
│  Reset your password                │
│  Enter the email on your account    │
│                                     │
│  [Email input          ]            │
│                                     │
│  [  Send Reset Link  ]              │
│  ← Back to sign in                  │
└─────────────────────────────────────┘
```

Always show success message regardless of whether email exists (anti-enumeration):
> "If that email is registered, you'll receive a link shortly."

**Step 2 — Reset Password** (from email link)

```
┌─────────────────────────────────────┐
│  Choose a new password              │
│                                     │
│  [New password         ] [👁]       │
│  [Confirm new password ] [👁]       │
│  [Password strength bar]            │
│                                     │
│  [  Save New Password  ]            │
└─────────────────────────────────────┘
```

- Expired link → error screen with "Request new link" CTA
- Already used link → same error screen
- Success → redirect to `/login` with success toast: "Password updated. Please sign in."

---

### 1.5 Social Auth (Google / GitHub)

- OAuth popup on desktop, redirect on mobile
- On first-time OAuth sign-in: brief "Setting up your account…" splash → `/dashboard`
- If OAuth email matches existing email+password account: prompt to merge accounts with single confirmation dialog
- Scope request: email + profile only (no unnecessary permissions)

---

### 1.6 Sign Out

- Available from user avatar dropdown in top nav
- Clears all session cookies
- Redirects to `/login` with no toast (clean exit)
- "Sign out of all devices" option in Settings > Security

---

### 1.7 Session Expiry

- 5 minutes before expiry: subtle banner in dashboard "Your session will expire soon. [Stay signed in]"
- On expiry: full-page overlay (not redirect) with sign-in form, pre-filled email
- On success: overlay closes, user stays on same page with their work preserved

---

---

## نمای فارسی — Screen Layouts (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> **فونت پیشنهادی:** `Vazirmatn` (متغیر) — جایگزین `Inter` در حالت فارسی
> **اعداد:** استفاده از ارقام فارسی (`۰–۹`) در برچسب‌ها؛ ارقام لاتین در فیلدهای ورودی ایمیل/پسورد

---

### ۱.۱ ثبت‌نام

```
┌─────────────────────────────────────┐
│                             [لوگو]  │
│                                     │
│                ساخت حساب کاربری     │
│         ← وارد شوید  حساب دارید؟   │
│                                     │
│            [        ورودی ایمیل ]   │
│      [👁]  [      ورودی رمز عبور ]  │
│      [👁]  [    تکرار رمز عبور  ]   │
│                                     │
│       CTA← [    ساخت حساب کاربری ] │
│                                     │
│  ──────── یا ادامه با ──────────── │
│              [گیت‌هاب GH] [گوگل G]  │
│                                     │
│     حریم خصوصی · شرایط استفاده     │
│           با ثبت‌نام می‌پذیرید       │
└─────────────────────────────────────┘
```

- نوار قدرت رمز عبور: ضعیف / متوسط / قوی (راست‌چین)
- پیام خطا زیر فیلد مربوطه، راست‌چین

---

### ۱.۲ تأیید ایمیل

```
┌─────────────────────────────────────┐
│                             [لوگو]  │
│                                     │
│          صندوق ورودی را بررسی کنید  │
│   j***@gmail.com لینک ارسال شد به   │
│                                     │
│         [  باز کردن Gmail  ]        │
│                                     │
│                ایمیل را نگرفتید؟    │
│    ایمیل دیگر · [ارسال مجدد]        │
│                                     │
│           لینک تا ۲۴ ساعت معتبر است │
└─────────────────────────────────────┘
```

---

### ۱.۳ ورود

```
┌─────────────────────────────────────┐
│                             [لوگو]  │
│                                     │
│                     خوش برگشتید     │
│         ← ثبت‌نام  حساب ندارید؟     │
│                                     │
│            [        ورودی ایمیل ]   │
│      [👁]  [      ورودی رمز عبور ]  │
│                                     │
│                  [    ورود    ]      │
│                                     │
│              رمز عبور را فراموش کردید؟│
│                                     │
│  ──────── یا ادامه با ──────────── │
│              [گیت‌هاب GH] [گوگل G]  │
└─────────────────────────────────────┘
```

---

### ۱.۴ فراموشی رمز عبور

**مرحله ۱ — درخواست بازنشانی**

```
┌─────────────────────────────────────┐
│                بازنشانی رمز عبور    │
│        ایمیل حساب خود را وارد کنید  │
│                                     │
│            [        ورودی ایمیل ]   │
│                                     │
│          [  ارسال لینک بازنشانی  ]  │
│                   بازگشت به ورود →  │
└─────────────────────────────────────┘
```

**مرحله ۲ — انتخاب رمز جدید**

```
┌─────────────────────────────────────┐
│                 انتخاب رمز عبور جدید│
│                                     │
│      [👁]  [       رمز عبور جدید ]  │
│      [👁]  [    تکرار رمز عبور  ]   │
│            [نوار قدرت رمز عبور ]    │
│                                     │
│            [  ذخیره رمز عبور جدید ] │
└─────────────────────────────────────┘
```

---

### نکات RTL برای صفحات احراز هویت

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| برچسب‌های فیلد | راست‌چین، بالای فیلد |
| آیکون نمایش/پنهان رمز | سمت چپ فیلد (در RTL) |
| پیام خطا | راست‌چین با آیکون در سمت راست |
| لینک «ورود / ثبت‌نام» | سمت چپ صفحه (انتهای خط RTL) |
| دکمه بازگشت | جهت فلش: → |
| کارت مرکزی | `max-w-[440px]` ثابت، بدون تغییر عرض |

---

## Accessibility

- All form fields have visible labels (not just placeholders)
- Error messages linked to inputs via `aria-describedby`
- Password show/hide button has `aria-label="Show password"` / `"Hide password"`
- Autofocus on first field, Enter submits form
- High-contrast compatible (no color-only error indicators)

## Empty / Loading States

| Scenario | Treatment |
|----------|-----------|
| OAuth loading | Full-page spinner with "Connecting to Google…" |
| Slow network | After 5s, show "This is taking longer than expected. [Cancel]" |

## Responsive Behavior

- Mobile: full-width card, no side padding
- Tablet+: centered card, max-width `440px`, `shadow-lg`, `rounded-2xl`
- Auth pages have no sidebar or top nav — only logo + footer links

---

## Mobile Layout

### Breakpoints

| Breakpoint | Card Width | Padding | Notes |
|------------|-----------|---------|-------|
| `< 640px` | 100% viewport | `px-4` | Full-bleed, no card shadow |
| `640–1023px` | `440px` centered | `px-0` | Card with shadow, rounded corners |
| `≥ 1024px` | `440px` centered | `px-0` | Same as tablet, optional split layout |

---

### Sign Up — Mobile

```
┌────────────────────────┐
│  [Logo]          320px │
│                        │
│  Create your account   │
│  Have one? Sign in →   │
│                        │
│ [Email               ] │
│ [Password          👁] │
│ [Confirm           👁] │
│ ░░ Weak password       │
│                        │
│ [   Create Account   ] │
│                        │
│ ─── or continue with ──│
│ [G Google][GH GitHub]  │
│                        │
│ Terms · Privacy Policy │
└────────────────────────┘
```

- Keyboard pushes content up — logo collapses or hides on very small screens (`< 375px`)
- Password strength bar renders below the field, full-width
- Both OAuth buttons stack at `< 360px`:
  ```
  [   G  Google   ]
  [  GH  GitHub   ]
  ```
- `inputmode="email"` on email field to trigger email keyboard on iOS/Android
- `inputmode="text"` + `autocomplete="new-password"` on password fields

---

### Sign In — Mobile

```
┌────────────────────────┐
│  [Logo]                │
│                        │
│  Welcome back          │
│  No account? Sign up → │
│                        │
│ [Email               ] │
│ [Password          👁] │
│                        │
│ [      Sign In       ] │
│                        │
│    Forgot password?    │
│                        │
│ ─── or continue with ──│
│ [G Google][GH GitHub]  │
└────────────────────────┘
```

- "Forgot password?" link: full-width tap target (`min-h-[44px]`), centered
- Error message appears as a full-width banner above the CTA (not a toast) on mobile — easier to read while keyboard is open

---

### Email Verification — Mobile

```
┌────────────────────────┐
│  [Logo]                │
│                        │
│  Check your inbox      │
│  Sent to               │
│  j***@gmail.com        │
│                        │
│  [    Open Gmail    ]  │
│                        │
│  Didn't receive it?    │
│  [Resend] · Other email│
│                        │
│  Expires in 24 hours   │
└────────────────────────┘
```

- "Open Gmail" button full-width on mobile, links to `googlegmail://` deep link on Android and `message://` on iOS where applicable
- No inline resend countdown animation — just disabled state with text "Resend in 45s"

---

### Forgot Password — Mobile

```
┌────────────────────────┐
│  Reset your password   │
│  Enter your email      │
│                        │
│ [Email               ] │
│                        │
│ [   Send Reset Link  ] │
│   ← Back to sign in    │
└────────────────────────┘
```

**Reset Password (step 2):**

```
┌────────────────────────┐
│  Choose a new password │
│                        │
│ [New password      👁] │
│ [Confirm password  👁] │
│ [strength bar        ] │
│                        │
│ [  Save New Password ] │
└────────────────────────┘
```

---

### Session Expiry Overlay — Mobile

On mobile, the overlay is a full-screen bottom sheet instead of a centered modal:

```
┌────────────────────────┐
│                        │
│  (dimmed page content) │
│                        │
├────────────────────────┤  ← bottom sheet handle
│  Session expired       │
│  Sign in to continue   │
│                        │
│ [Email               ] │
│ [Password          👁] │
│                        │
│ [      Sign In       ] │
│                        │
│  Sign in as different  │
│  user →                │
└────────────────────────┘
```

---

### Touch & Interaction Notes

| Interaction | Mobile Behavior |
|-------------|----------------|
| Form submission | Tap CTA — keyboard dismisses, spinner shows |
| Validation error | Scrolls to first error field automatically |
| OAuth button | Full redirect (no popup) on mobile browsers |
| Password reveal | Tap icon — hold not required |
| Back navigation | Native back gesture works (no history manipulation) |
| Autofill | `autocomplete` attributes set for all fields to support iOS/Android autofill |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/verify-email/page.tsx`
- `app/forgot-password/page.tsx`
- `app/reset-password/page.tsx`
- Feature-local UI under `features/auth/`

### Reuse Order

1. Use `components/ui` form primitives first: `Input`, `Button`, `Field`, `Alert`, `Card`-style layouts if already present.
2. Keep auth pages outside the dashboard shell.
3. Add feature-local auth sections before creating new shared components.

### Frontend-Only Rules

- No real authentication, session creation, OAuth, email sending, or password reset handling.
- All flows are UI simulations with local form state, inline validation, fake loading delays, and mock redirects.
- Social auth buttons are presentation-only unless a later project phase adds real providers.
- Verification, reset-link expiry, account-locked, and unverified-email flows should exist as visual states, not backend logic.

### Required View Models

- Signup state: `default`, `withReferral`, `submitting`, `success`, `emailTaken`, `serverError`
- Login state: `default`, `submitting`, `wrongCredentials`, `accountLocked`, `unverifiedEmail`
- Forgot password state: `default`, `submitting`, `success`
- Reset password state: `default`, `expiredLink`, `usedLink`, `success`

### Done Criteria

- All auth screens render with local validation and clear error/success states.
- Referral-aware signup states align with `08-referral.md`.
- Mobile and RTL variants remain visually consistent with the design system.
- No network layer, provider SDK, or persistence is introduced.

### In Scope Now

- Signup, sign-in, verification, forgot-password, reset-password, and session-expiry screens as frontend-only flows.
- Referral-aware signup UI, inline validation, and state-based messaging.
- Demo navigation between auth screens.

### Out Of Scope Now

- Real auth providers, OAuth handshakes, email sending, password reset tokens, session cookies, and server-backed account checks.
- Persisting auth state across refresh.

### Sample Data

```ts
const authDemoState = {
  signup: {
    referrerName: "Sina",
    referralCode: "SINA42",
    emailMasked: "j***@gmail.com",
    state: "withReferral",
  },
  login: {
    email: "sina@example.com",
    state: "default",
  },
  forgotPassword: {
    email: "sina@example.com",
    state: "success",
  },
}
```
