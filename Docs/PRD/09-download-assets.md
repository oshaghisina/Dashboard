# 09 — Download Assets

## Purpose

Give users a single dashboard page where they can find, compare, and open download links for VPN client apps across major operating systems so they can use their config with the right app on Android, iPhone, iPad, macOS, Windows, and Linux.

---

## User Stories

| # | As a… | I want to… | So that… |
|---|-------|-----------|---------|
| US-1 | New user | See recommended apps for my device | I can start using my config quickly |
| US-2 | Mobile user | Download the right app for Android or iPhone | I avoid choosing the wrong client |
| US-3 | Desktop user | Find compatible apps for macOS, Windows, and Linux | I can set up the VPN on my computer |
| US-4 | Less technical user | Read a short install guide for each platform | I know what to do after download |
| US-5 | User with multiple devices | Compare app options across OSes | I can choose the best client per device |

---

## Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/downloads` | Client app downloads page inside the dashboard |

---

## Page Goal

This page should reduce setup friction after the user gets a config. The primary action is selecting a platform and opening a client download link. The secondary action is reading a short install guide for that platform.

---

## Screen Layout (Desktop)

```
┌────────────────────────────────────────────────────────────────────┐
│  Download Apps                                                    │
│  Find the right VPN client for your device and import your config │
├────────────────────────────────────────────────────────────────────┤
│  [All] [Android] [iPhone/iPad] [macOS] [Windows] [Linux]         │
│                                                                    │
│  Recommended for you                                               │
│  ┌────────────────────────────┐ ┌───────────────────────────────┐  │
│  │ Android                    │ │ macOS                         │  │
│  │ V2RayNG                    │ │ Nekoray                       │  │
│  │ Best for most Android users│ │ Best for most desktop users   │  │
│  │ [Download App] [Guide]     │ │ [Download App] [Guide]        │  │
│  └────────────────────────────┘ └───────────────────────────────┘  │
│                                                                    │
│  All apps                                                          │
│  ┌────────────────────────────┐ ┌───────────────────────────────┐  │
│  │ Android · V2RayNG          │ │ iPhone/iPad · Shadowrocket    │  │
│  │ Free · Store link          │ │ Paid · App Store              │  │
│  │ VMess · VLESS · Trojan     │ │ VMess · VLESS · Trojan        │  │
│  │ [Download] [Guide] [Site]  │ │ [Download] [Guide] [Site]     │  │
│  └────────────────────────────┘ └───────────────────────────────┘  │
│  ┌────────────────────────────┐ ┌───────────────────────────────┐  │
│  │ Windows · Nekoray          │ │ Linux · Nekoray              │  │
│  │ Free · GitHub release      │ │ Free · GitHub release         │  │
│  │ VMess · VLESS · Trojan     │ │ VMess · VLESS · Trojan        │  │
│  │ [Download] [Guide] [Site]  │ │ [Download] [Guide] [Site]     │  │
│  └────────────────────────────┘ └───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 9.1 Platform Filter Row

- Horizontal filter chips for `All`, `Android`, `iPhone/iPad`, `macOS`, `Windows`, `Linux`
- Active filter uses filled or highlighted state
- On smaller screens, this row scrolls horizontally

### 9.2 Recommended Apps Section

- Appears above the full list
- Shows 1–2 highlighted cards based on the current platform filter or a default recommendation set
- Uses stronger visual emphasis than normal app cards
- Each card includes:
  - OS label
  - app name
  - short recommendation reason
  - compatibility summary
  - `Download App` CTA
  - `Guide` CTA

### 9.3 App Cards

Each card should include:

| Field | Content |
|------|---------|
| OS | `Android`, `iPhone/iPad`, `macOS`, `Windows`, `Linux` |
| App name | e.g. `V2RayNG`, `Shadowrocket`, `Nekoray`, `Clash Verge` |
| Pricing badge | `Free`, `Paid`, or `Open Source` |
| Source badge | `App Store`, `Play Store`, `GitHub`, `Official Site` |
| Protocol support | `VMess`, `VLESS`, `Trojan`, `Shadowsocks` |
| Best-for label | Short phrase like `Best for beginners` |
| Actions | `Download`, `Guide`, `Official Site` |

### 9.4 Install Guide Panel

When the user clicks `Guide`, open a modal on desktop or bottom sheet on mobile with:

```
┌──────────────────────────────────────┐
│  Install Guide — V2RayNG         ✕   │
│                                      │
│  1. Download and open the app        │
│  2. Go to the Configs page           │
│  3. Tap Copy Link or open QR         │
│  4. Import the config in the app     │
│                                      │
│  Tips                                │
│  - Allow clipboard access if asked   │
│  - Prefer the latest stable release  │
│                                      │
│  [Open Download]                     │
└──────────────────────────────────────┘
```

- 3–5 steps maximum
- Plain text only in v1
- Optional note if an app is paid or store-restricted

### 9.5 Compatibility Summary

Optional compact section below the hero area:

| Platform | Recommended App | Notes |
|----------|-----------------|------|
| Android | V2RayNG | Easiest clipboard import |
| iPhone/iPad | Shadowrocket | Paid app, strong compatibility |
| macOS | Nekoray | Good desktop import flow |
| Windows | Nekoray | Stable for most users |
| Linux | Nekoray | AppImage or archive flow |

---

## States Summary

| Scenario | UI Response |
|----------|-------------|
| Loading | Skeleton cards and skeleton filter chips |
| Populated | Recommended section + app card grid |
| Filtered | Only matching platform cards shown |
| No matches | Empty state with reset filter action |
| External link unavailable | Disabled download button + helper text |
| Guide open | Modal or bottom sheet with platform instructions |
| Error | Error card with retry action |

---

## Suggested App Inventory

These are placeholder app suggestions for frontend content and may be adjusted later:

| Platform | App | Source | Pricing | Notes |
|----------|-----|--------|---------|------|
| Android | V2RayNG | Play Store / GitHub | Free | Strong default for Android |
| Android | Clash Meta for Android | GitHub | Free | Alternative for advanced users |
| iPhone/iPad | Shadowrocket | App Store | Paid | Best iOS compatibility |
| iPhone/iPad | Stash | App Store | Paid | Alternative premium client |
| macOS | Nekoray | GitHub | Free | Good V2Ray/Xray support |
| macOS | Clash Verge | GitHub | Free | Alternative with different UX |
| Windows | Nekoray | GitHub | Free | Recommended default |
| Windows | Clash Verge | GitHub | Free | Alternative for advanced users |
| Linux | Nekoray | GitHub | Free | Recommended default |
| Linux | Clash Verge | GitHub | Free | Alternative client |

---

## Copy Guidance

- Page title: `Download Apps`
- Page description: `Choose the right client for your device, then import your Tunnel config.`
- Recommended label: `Recommended for you`
- Main CTA: `Download App`
- Secondary CTA: `Guide`
- Tertiary CTA: `Official Site`
- Empty state title: `No apps match this filter`
- Empty state description: `Try another platform or reset the filters.`

---

## Mobile Layout

### Screen Layout — Mobile

```
┌────────────────────────────┐
│  Download Apps             │
│  Choose a client           │
│  ────────────────────────  │
│ [All][Android][iPhone] →   │
│  ────────────────────────  │
│  Recommended               │
│  ┌──────────────────────┐  │
│  │ Android              │  │
│  │ V2RayNG              │  │
│  │ [Download App]       │  │
│  │ [Guide]              │  │
│  └──────────────────────┘  │
│  ────────────────────────  │
│  All apps                  │
│  ┌──────────────────────┐  │
│  │ iPhone/iPad          │  │
│  │ Shadowrocket         │  │
│  │ [Download][Guide]    │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

- Filter row scrolls horizontally
- Cards stack in a single column
- `Download App` stays full-width on mobile
- `Guide` opens a bottom sheet instead of a centered dialog

---

## Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Tap platform filter | Updates visible cards immediately |
| Swipe filter row | Horizontal scroll |
| Tap `Download App` | Opens external link in new tab or current context |
| Tap `Guide` | Opens mobile bottom sheet or desktop modal |
| Swipe guide sheet down | Dismisses guide |
| Tap `Official Site` | Opens vendor or project page |

---

## Persian / RTL Screen Layout (نمای فارسی)

> **جهت:** راست به چپ (`dir="rtl"`)

### داشبورد دانلود اپ‌ها (فارسی)

```
┌────────────────────────────────────────────────────────────────┐
│                                               دانلود اپ‌ها     │
│      برای دستگاه خود اپ مناسب را انتخاب کنید و کانفیگ را وارد کنید │
├────────────────────────────────────────────────────────────────┤
│ [لینوکس] [ویندوز] [مک] [آیفون/آیپد] [اندروید] [همه]           │
│                                                                │
│                                         پیشنهاد برای شما       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ اندروید                                                 │  │
│  │ V2RayNG                                                 │  │
│  │ مناسب بیشتر کاربران اندروید                             │  │
│  │               [راهنما]  [دانلود اپ]                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│                                               همه اپ‌ها        │
│  ┌────────────────────────────┐ ┌──────────────────────────┐   │
│  │ ویندوز · Nekoray          │ │ آیفون/آیپد · Shadowrocket│   │
│  │ رایگان · گیت‌هاب          │ │ پولی · اپ استور          │   │
│  │ [سایت] [راهنما] [دانلود]  │ │ [سایت] [راهنما] [دانلود] │   │
│  └────────────────────────────┘ └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### نکات RTL برای صفحه دانلود اپ‌ها

| عنصر | رفتار در حالت فارسی |
|------|---------------------|
| ردیف فیلترها | از راست به چپ نمایش داده می‌شود |
| کارت پیشنهادی | دکمه اصلی در سمت چپ کارت، متن راست‌چین |
| برچسب‌های سیستم‌عامل | راست‌چین |
| دکمه‌های اکشن | ترتیب از راست: دانلود / راهنما / سایت |
| مودال یا شیت راهنما | دکمه بستن در سمت چپ هدر |

---

## Frontend Build Notes For This Repo

### Implementation Targets

- `app/dashboard/downloads/page.tsx`
- `features/downloads/download-assets-page.tsx`
- Optional feature-local cards or guide components under `features/downloads/`
- Mock app inventory in `mock-data/` or feature-local data files

### Reuse Order

1. Use `DashboardPage` for the route shell.
2. Use `PageSection` for recommended apps, app grid, and compatibility summary.
3. Use `SectionCard` or feature-local cards for each app entry.
4. Use `EmptyState` when a filter produces no matching results.
5. Use existing `Button`, `Badge`, `Dialog`, `Sheet`, and `ScrollArea` primitives before adding new shared UI.

### Frontend-Only Rules

- All app listings, links, compatibility notes, and install steps are static frontend content for now.
- External links may be mocked or use placeholder URLs in the first pass.
- No device detection, store deep-link verification, analytics tracking, or asset hosting logic is required.
- The page should connect conceptually to the Configs page, but does not need to import or inspect actual config data.

### Required View Model

- `platformFilter`
- `recommendedApps[]`
- `apps[]`
- `apps[i].id`
- `apps[i].platform`
- `apps[i].name`
- `apps[i].pricing`
- `apps[i].source`
- `apps[i].protocols[]`
- `apps[i].bestFor`
- `apps[i].downloadUrl`
- `apps[i].officialSiteUrl`
- `apps[i].guideSteps[]`
- `apps[i].disabledReason`

### Required States

- Loading state with skeleton cards
- Populated state
- Filtered state
- No-results empty state
- Disabled download state
- Guide modal or sheet open state
- Error state with retry action

### In Scope Now

- Dashboard page, platform filters, app cards, install guide modal or sheet, and static compatibility content.

### Out Of Scope Now

- OS auto-detection, app version tracking, live release syncing, download analytics, or real asset hosting.

### Sample Data

```ts
const downloadAssetsDemo = {
  platformFilter: "all",
  recommendedApps: [
    {
      id: "android-v2rayng",
      platform: "Android",
      name: "V2RayNG",
      pricing: "Free",
      source: "Play Store",
      protocols: ["VMess", "VLESS", "Trojan"],
      bestFor: "Best for most Android users",
      downloadUrl: "https://example.com/android-v2rayng",
      officialSiteUrl: "https://example.com/v2rayng",
      guideSteps: [
        "Download and open the app.",
        "Go to the Configs page in Tunnel.",
        "Copy the config link or open the QR code.",
        "Import the config in V2RayNG.",
      ],
      disabledReason: null,
    },
  ],
  apps: [
    {
      id: "ios-shadowrocket",
      platform: "iPhone/iPad",
      name: "Shadowrocket",
      pricing: "Paid",
      source: "App Store",
      protocols: ["VMess", "VLESS", "Trojan"],
      bestFor: "Best iOS compatibility",
      downloadUrl: "https://example.com/ios-shadowrocket",
      officialSiteUrl: "https://example.com/shadowrocket",
      guideSteps: [
        "Install Shadowrocket from the App Store.",
        "Return to Tunnel and copy your config link.",
        "Open Shadowrocket and add from clipboard.",
      ],
      disabledReason: null,
    },
  ],
}
```

### Done Criteria

- Users can browse apps by platform and clearly identify the recommended client for each OS.
- App cards expose the correct local content fields and actions without backend logic.
- Guide content opens in a modal on desktop and a sheet on mobile.
- Empty, loading, and disabled states are explicitly implemented.