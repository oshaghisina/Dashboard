# 03 — V2Ray Config Files

## Purpose

Let users quickly retrieve and import their V2Ray configuration into any client (V2RayNG, Shadowrocket, Clash, Nekoray, etc.) with zero manual transcription — via QR code, one-click copy, or file download.

---

## Route

`/dashboard/configs`

---

## Screen Layout (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Configs                           [+ Request Config]          │
│  Your active connection profiles                               │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐ ┌──────────────────────────┐ │
│  │ Frankfurt · VMess            │ │ Amsterdam · VLESS        │ │
│  │ ● Active                     │ │ ● Active                  │ │
│  │ 🇩🇪 DE · TLS · WebSocket    │ │ 🇳🇱 NL · TLS · gRPC      │ │
│  │                              │ │                           │ │
│  │ [Copy Link] [QR] [Download]  │ │ [Copy Link] [QR] [Download│ │
│  │ [Details ↓]                  │ │ [Details ↓]               │ │
│  └──────────────────────────────┘ └──────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────┐                              │
│  │ Tokyo · Trojan               │                              │
│  │ ⬤ Inactive (plan expired)   │                              │
│  │ 🇯🇵 JP · TLS                │                              │
│  │                              │                              │
│  │ [Copy Link] [QR] [Download]  │                              │
│  │ [Details ↓]     (disabled)   │                              │
│  └──────────────────────────────┘                              │
└────────────────────────────────────────────────────────────────┘
```

---

## Config Card

### Header
- **Server name** — human-readable, e.g., "Frankfurt · VMess"
- **Status badge** — `Active` (green) / `Inactive` (muted) / `Expiring Soon` (amber)
- **Flag + Country code** — ISO flag emoji + country name
- **Protocol chips** — `VMess`, `VLESS`, `Trojan`, `Shadowsocks`
- **Transport chips** — `WebSocket`, `gRPC`, `TCP`, `HTTP/2`
- **Security chip** — `TLS` or `None`

### Action Buttons (always visible)

| Button | Action | Feedback |
|--------|--------|----------|
| Copy Link | Copies `vmess://...` URI to clipboard | Button text → "Copied!" for 2s, then resets |
| QR | Opens QR modal | — |
| Download | Downloads `.json` config file | Browser native download |

- If plan expired: all buttons show `disabled` state with tooltip "Renew your plan to use this config"

### Expandable Details Panel

Collapsed by default. On "Details ↓" click, expands inline:

```
┌────────────────────────────────────────┐
│  Server       de-01.tunnel.app         │
│  Port         443                      │
│  UUID         xxxxxxxx-xxxx-xxxx-xxxx  │ [Copy]
│  Path         /ws                      │
│  Host SNI     de-01.tunnel.app         │
│  Alter ID     0                        │
│  Network      ws                       │
│  TLS          tls                      │
│                                        │
│  [Copy raw JSON]  [View JSON]          │
└────────────────────────────────────────┘
```

- Sensitive fields (UUID) partially masked: `xxxxxxxx-xxxx-…` with reveal-on-click
- "Copy raw JSON" copies full Xray/V2Ray JSON to clipboard
- "View JSON" opens a read-only code viewer drawer

---

## QR Code Modal

```
┌───────────────────────────────────────┐
│  Frankfurt · VMess Config         ✕   │
│                                       │
│  ┌─────────────────────────┐          │
│  │                         │          │
│  │      [QR CODE]          │          │
│  │                         │          │
│  └─────────────────────────┘          │
│                                       │
│  Scan this with your VPN client       │
│  (V2RayNG, Shadowrocket, Nekoray…)    │
│                                       │
│  [Download QR Image]                  │
│  [Copy Link Instead]                  │
└───────────────────────────────────────┘
```

- QR size: `280×280px` on desktop, full-width on mobile
- High error-correction level (`H`) so it's scannable at an angle
- White background always (even in dark mode) — QR scanners need contrast
- Download QR as PNG: `config-frankfurt-vmess.png`

---

## JSON Viewer Drawer

Slides in from the right (desktop) or from bottom (mobile):

```
┌─────────────────────────────────────────┐
│  Raw Config — Frankfurt · VMess     ✕   │
│  ─────────────────────────────────────  │
│  {                                      │
│    "v": "2",                            │
│    "ps": "Frankfurt-VMess",             │
│    "add": "de-01.tunnel.app",           │
│    "port": "443",                       │
│    ...                                  │
│  }                                      │
│  ─────────────────────────────────────  │
│  [Copy All]                [Download]   │
└─────────────────────────────────────────┘
```

- Syntax-highlighted (using `shiki` or inline `<pre>` with Tailwind)
- Read-only
- Line numbers shown

---

## Import Guide Panel

Collapsible section below configs titled "How to import your config":

```
How to import your config   [Collapse ↑]

  ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
  │V2RayNG│ │Shadowrocket│ │ Clash │ │ Nekoray  │
  └──────┘ └──────────┘ └────────┘ └──────────┘

  V2RayNG (Android)
  1. Tap + → Import config from clipboard
  2. Tap [Copy Link] above, then return to V2RayNG

  Shadowrocket (iOS)
  1. Tap + → Type → Add from clipboard
  2. Tap [Copy Link] above
```

Tabs per client, each with 2–3 step instructions. Steps are plain text, no images needed in v1.

---

---

## نمای فارسی — Screen Layout (Persian / RTL)

> **جهت:** راست به چپ (`dir="rtl"`)
> دکمه‌های اکشن از سمت چپ کارت به سمت راست منتقل می‌شوند

### صفحه اصلی کانفیگ‌ها (دسکتاپ)

```
┌────────────────────────────────────────────────────────────────┐
│  [درخواست کانفیگ +]                            کانفیگ‌ها       │
│                               پروفایل‌های اتصال فعال شما       │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐ ┌──────────────────────────┐ │
│  │           VMess · فرانکفورت │ │         VLESS · آمستردام │ │
│  │                    فعال ●   │ │                  فعال ●  │ │
│  │  WebSocket · TLS · DE 🇩🇪   │ │    gRPC · TLS · NL 🇳🇱   │ │
│  │                             │ │                          │ │
│  │  [↓ دانلود] [QR] [کپی لینک]│ │  [↓ دانلود][QR][کپی لینک│ │
│  │           [↓ جزئیات]        │ │          [↓ جزئیات]      │ │
│  └──────────────────────────────┘ └──────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────┐                              │
│  │          Trojan · توکیو      │                              │
│  │    (پلن منقضی شده)  ⬤ غیرفعال│                              │
│  │              TLS · JP 🇯🇵    │                              │
│  │                             │                              │
│  │  [↓ دانلود] [QR] [کپی لینک] │                              │
│  │    (غیرفعال)   [↓ جزئیات]   │                              │
│  └──────────────────────────────┘                              │
└────────────────────────────────────────────────────────────────┘
```

### پانل جزئیات باز شده (فارسی)

```
┌────────────────────────────────────────┐
│       de-01.tunnel.app       سرور      │
│               ۴۴۳            پورت      │
│  [کپی]  xxxxxxxx-xxxx-xxxx-xxxx  UUID  │
│              /ws             مسیر      │
│       de-01.tunnel.app       SNI       │
│               ۰            شناسه تغییر │
│              ws             شبکه       │
│              tls              TLS      │
│                                        │
│         [مشاهده JSON]  [کپی JSON خام]  │
└────────────────────────────────────────┘
```

- فیلدهای حساس (UUID) به‌صورت پیش‌فرض پنهان، با کلیک نمایش داده می‌شوند
- برچسب‌های ستون سمت راست، مقادیر سمت چپ

### مودال QR کد (فارسی)

```
┌───────────────────────────────────────┐
│  ✕         کانفیگ VMess · فرانکفورت  │
│                                       │
│       ┌─────────────────────────┐     │
│       │                         │     │
│       │       [QR CODE]         │     │
│       │                         │     │
│       └─────────────────────────┘     │
│                                       │
│   با اپلیکیشن VPN خود اسکن کنید      │
│   (Nekoray ،Shadowrocket ،V2RayNG…)   │
│                                       │
│         [کپی لینک]                    │
│         [دانلود تصویر QR]             │
└───────────────────────────────────────┘
```

### درج درپوش JSON (فارسی)

```
┌─────────────────────────────────────────┐
│  ✕    VMess · فرانکفورت — کانفیگ خام   │
│  ─────────────────────────────────────  │
│  {                                      │
│    "v": "2",                            │
│    "ps": "Frankfurt-VMess",             │
│    "add": "de-01.tunnel.app",           │
│    ...                                  │
│  }                                      │
│  ─────────────────────────────────────  │
│  [دانلود]                    [کپی همه]  │
└─────────────────────────────────────────┘
```

### راهنمای وارد کردن کانفیگ (فارسی)

```
چطور کانفیگ را وارد کنید   [← جمع کردن]

  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────┐
  │  Nekoray │ │ Clash  │ │Shadowrocket│ │V2RayNG│
  └──────────┘ └────────┘ └──────────┘ └──────┘

  V2RayNG (اندروید)
  ۱. روی + بزنید ← وارد کردن از کلیپ‌بورد
  ۲. [کپی لینک] را بزنید، سپس به V2RayNG برگردید
```

### موبایل (فارسی)

```
┌──────────────────────────┐
│              کانفیگ‌ها   │
│  ──────────────────────  │
│  ┌────────────────────┐  │
│  │  VMess · فرانکفورت │  │
│  │  DE 🇩🇪 · فعال ●   │  │
│  │  [↓][QR][کپی]      │  │
│  │     [↓ جزئیات]     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  VLESS · آمستردام  │  │
│  │  NL 🇳🇱 · فعال ●   │  │
│  │  [↓][QR][کپی]      │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### نکات RTL برای صفحه کانفیگ

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| دکمه‌های اکشن | از راست: [کپی لینک] [QR] [دانلود] |
| چیپ‌های پروتکل | ردیف از راست شروع می‌شود |
| فلش «جزئیات» | ↓ (بدون تغییر — عمودی) |
| درپوش JSON | از راست اسلاید می‌کند (در حالت RTL) |
| دکمه بستن مودال | سمت چپ هدر مودال |

---

## Empty States

| Scenario | Display |
|----------|---------|
| No configs assigned yet | Illustration + "Your configs will appear here once your plan is activated." |
| Plan expired, configs exist | Cards shown but disabled; banner: "Renew your plan to re-enable configs" |
| Loading | 2–3 skeleton config cards |
| Error fetching | Error card + retry button |

---

## Sorting & Filtering (v2, not MVP)

- Filter by protocol: All · VMess · VLESS · Trojan
- Filter by region: All · EU · Asia · Americas
- Sort: by name, by latency (future — requires ping feature)

---

## Security Considerations

- Config URIs and UUIDs are treated as secrets — never logged, never pre-filled in URLs
- UUID masked by default in Details panel
- Download file named generically: `tunnel-config-{hash}.json` (not including server hostname)
- QR code generated client-side from the already-loaded config URI — no extra API call

---

## Mobile Layout & Responsive Behavior

### Breakpoints

| Breakpoint | Card Layout | Action Buttons | QR Modal |
|------------|------------|---------------|---------|
| `< 640px` | Full-width, stacked | Icon-only with tooltip | Full-screen bottom sheet |
| `640–1023px` | Full-width, stacked | Icon + label | Center modal (80vw) |
| `≥ 1024px` | 2-column grid | Icon + label | Center modal (440px) |

---

### Config List — Mobile

```
┌──────────────────────────┐
│  Configs          320px  │
│  ──────────────────────  │
│  ┌────────────────────┐  │
│  │ Frankfurt · VMess  │  │
│  │ ● Active · 🇩🇪 · TLS│  │
│  │ [WS]               │  │
│  │                    │  │
│  │ [📋][⬛][⬇]  ···   │  │
│  │ Details ↓          │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Amsterdam · VLESS  │  │
│  │ ● Active · 🇳🇱 · TLS│  │
│  │ [gRPC]             │  │
│  │                    │  │
│  │ [📋][⬛][⬇]  ···   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

- Icon buttons: Copy (📋), QR (⬛), Download (⬇)
- `···` overflow button reveals secondary actions in a sheet
- Min tap target for each button: `44×44px`
- Protocol chips wrap to next line if too many for one row

---

### Expanded Details Panel — Mobile

Details panel opens inline below the card header (same as desktop), but the raw JSON fields use a more compact layout:

```
┌────────────────────────────┐
│ Frankfurt · VMess  Details ↑│
│ ─────────────────────────  │
│ Server   de-01.tunnel.app  │
│ Port     443               │
│ UUID     xxxx-… [👁][Copy] │
│ Path     /ws               │
│ TLS      tls               │
│                            │
│ [View JSON]  [Copy JSON]   │
└────────────────────────────┘
```

---

### QR Code — Full-Screen Bottom Sheet (Mobile)

```
┌──────────────────────────┐
│  ────                    │  ← drag handle
│                          │
│  Frankfurt · VMess       │
│                          │
│  ┌──────────────────┐    │
│  │                  │    │
│  │    [QR CODE]     │    │
│  │                  │    │
│  └──────────────────┘    │
│                          │
│  Scan with V2RayNG,      │
│  Shadowrocket…           │
│                          │
│  [Download QR Image]     │
│  [Copy Link Instead]     │
│                          │
│       ────────           │  ← home indicator safe area
└──────────────────────────┘
```

- QR fills `min(80vw, 280px)` — neither too small to scan nor overflowing
- Bottom sheet respects safe area inset (`pb-safe`)
- Drag handle at top; swipe down or tap backdrop to close
- Scroll disabled while sheet is open

---

### JSON Viewer — Bottom Sheet (Mobile)

On mobile the JSON drawer slides up from the bottom (not from the right):

```
┌──────────────────────────┐
│  ────                    │
│  Raw Config  Frankfurt   │
│  ─────────────────────── │
│  {                       │
│    "v": "2",             │
│    "ps": "Frankfurt",    │
│    ...                   │
│  }                       │  ← scrollable
│  ─────────────────────── │
│  [Copy All] [Download]   │
└──────────────────────────┘
```

- Sheet takes 80% of screen height, scrollable inside
- Pinch-to-zoom not needed — font `text-xs` + horizontal scroll for long lines

---

### Import Guide — Mobile

The client tabs collapse into a horizontal scroll row (no wrapping):

```
┌──────────────────────────┐
│ ← [V2RayNG][Shadowrocket]│
│    [Clash] [Nekoray] →   │
│  ──────────────────────  │
│  V2RayNG (Android)       │
│  1. Tap + → Import from  │
│     clipboard            │
│  2. Tap [Copy] above     │
└──────────────────────────┘
```

---

### Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Tap "Copy Link" | Haptic feedback + button state change |
| Long-press card | Context menu: Copy / QR / Download |
| Swipe card left | Reveals Copy + QR shortcut buttons |
| Tap QR button | Opens full-screen bottom sheet |
| Swipe QR sheet down | Closes sheet |
| Pull-to-refresh | Refreshes local demo state only |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/configs/page.tsx`
- `features/configs/configs-page.tsx`
- Feature-local helper components under `features/configs/`
- Mock config payloads in `mock-data/` or feature-local data files

### Reuse Order

1. Use `DashboardPage` and `PageSection` for overall layout.
2. Reuse `Button`, `Badge`, `Card`, and existing dashboard section primitives before adding new shared UI.
3. Keep QR, JSON viewer, and import guide helpers feature-local unless another page needs them.

### Frontend-Only Rules

- Config URIs, raw JSON, and QR codes are all generated from mock strings already available in the frontend.
- No server fetch, entitlement check, file-signing, or secure download flow is needed in this phase.
- `Copy`, `Download`, `QR`, `View JSON`, and `Copy raw JSON` are UI actions only.
- Disabled states for expired plans should be represented visually from mock data.

### Required View Model

- `configs[]`
- `configs[i].id`
- `configs[i].name`
- `configs[i].region`
- `configs[i].protocol`
- `configs[i].transport`
- `configs[i].security`
- `configs[i].status`
- `configs[i].uri`
- `configs[i].rawJson`
- `configs[i].details`
- `showImportGuide`

### Done Criteria

- Cards support active, expiring, inactive, empty, loading, and error variants.
- QR modal or sheet and JSON viewer open from local state only.
- Copy/download actions provide visible feedback without introducing backend logic.

### In Scope Now

- Config cards, details accordion, QR view, raw JSON viewer, copy actions, disabled states, and import guide.

### Out Of Scope Now

- Entitlement checks, secure downloads, remote config refresh, telemetry, and true secret handling beyond masked UI display.

### Sample Data

```ts
const configDemo = {
  id: "cfg-de-vmess",
  name: "Frankfurt · VMess",
  region: "Germany",
  protocol: "VMess",
  transport: "WebSocket",
  security: "TLS",
  status: "active",
  uri: "vmess://demo-frankfurt-config",
  rawJson: '{"ps":"Frankfurt-VMess","add":"de-01.tunnel.app","port":"443"}',
  details: {
    host: "de-01.tunnel.app",
    port: "443",
    uuidMasked: "xxxx-xxxx-...",
    path: "/ws",
    network: "ws",
  },
}
```
