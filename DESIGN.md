# GemuKore visual direction

Updated 2026-11-11 for the user's supplied GemuKore dashboard image. This explicitly replaces the earlier Fambly/warm-paper visual direction. The original HTML in `docs/design/references/` is historical supporting material. Product, authorization, data and provider boundaries remain defined by `PROJECT_SPEC.md`.

## Reference and palette

The private application is an illuminated burgundy workspace that fills the available viewport, with a dark wine navigation rail, rounded plum panels, cream-white text, hot pink selection/links, golden primary actions and selective violet details. The shared shell has no outer margin, maximum width, rounded frame or surrounding shadow. Keep comfortable internal spacing around navigation and content. Public pages retain their pale blush surround. The dashboard follows the supplied composition: wide illustrated collection hero, three category shortcuts, recent additions, latest copy and a right-hand statistics panel.

Centralize theme values in `src/app/globals.css` and private-workspace values in `src/app/workspace.css`. Use semantic Tailwind/shadcn variables in reusable controls. Artwork and authored category illustrations may have their own colors.

| Role           | Light/public surface | Private workspace     |
| -------------- | -------------------- | --------------------- |
| Page surround  | `#fbdae4`            | viewport workspace    |
| Background     | `#fce6ed`            | `#38121f`             |
| Foreground     | `#401426`            | `#fff1f6`             |
| Card           | `#fff4f7`            | `#34111f`             |
| Muted text     | `#79405b`            | `#e0b8cf`             |
| Primary        | `#b91e4e` / white    | `#ffcc68` / `#3a1422` |
| Link           | `#a51c49`            | `#ffa6c5`             |
| Input boundary | `#a85b78`            | `#c17c99`             |
| Focus          | `#ad1749`            | `#ffd17a`             |

Dark and system appearance remain supported with the existing `gemukore-theme` storage key. Dark appearance deepens the surround and workspace while retaining the same palette. Public pages and authentication use coordinated blush/wine semantic themes. Small text requires at least 4.5:1 contrast; essential icons, focus indicators and input boundaries require 3:1. Color alone never conveys status. A box count does not establish completeness.

## Typography and spacing

Use the locally hosted pixel display font for the brand and dashboard hero, Inter for controls, body copy and dashboard section headings, and Plus Jakarta Sans for other application headings. Keep full font licenses alongside the bundled binaries. No visitor-time remote font requests.

Use a 4px spacing scale, 16–28px workspace gaps, 20–30px panel corners, pill controls and a 44px minimum target for interactive controls. Preserve readable form sizes and visible labels. Warm text on dark surfaces, subtle pink edges and soft shadows provide depth without obscuring controls.

## Shell and dashboard

At desktop widths the shared application shell has a narrow icon rail, a visible current-page indicator, named icon controls, labels available on hover and keyboard focus, brand/header, appearance control and page content. The dashboard places search and sign-out in the header and role-authorized creation links in the add-item menu. Existing destination services still authorize every operation.

The dashboard uses a semantic server-rendered Bento layout with real owned-copy totals, category counts, confirmed box count, active-defect copy count and the bounded recent-copy DTO. Do not substitute the reference's sample numbers, game titles, username, notifications, cart, favorites or trailer controls for actual functionality. Category shortcuts navigate to the existing filtered collection. Cards and the latest row link to distinct owned copies.

For viewports at least 1024px wide and 640px high, the default dashboard is sized to the available viewport with no vertical page scrolling. Physical monitor inches cannot be detected reliably. Use responsive rows and bounded presentation, not `overflow: hidden` on the document. Recent additions use a horizontal, keyboard-accessible carousel; arrow controls navigate the complete eight-copy list. All entries remain in server HTML. Other application pages retain natural document scrolling.

At smaller widths/heights and effective zoomed viewports, return to natural page flow. Mobile keeps the accessible navigation sheet, stacks dashboard sections and preserves touch targets. At 320px and enlarged text, do not introduce horizontal document overflow or hide essential actions. Long display labels must remain inspectable through their copy detail pages.

## Artwork and data integrity

`public/images/dashboard/reference-art.png` is the user-supplied dashboard reference. The hero displays only its right-hand illustration using CSS clipping/masking; the source image is unedited and no sample text, controls or statistics are rendered as application data. This is decorative private-workspace artwork, not a catalog asset, photograph or evidence of collection ownership. See `docs/design/DASHBOARD_ASSETS.md` for provenance.

Recent additions and the latest row use the existing authorized private-photo pipeline. Preserve image proportions. Missing or failed images have explicit local fallbacks. Never replace collection photos with unrelated game artwork. Authored hardware vectors symbolize the three collection categories and do not assert ownership of particular hardware models.

## Motion and accessibility

Use shadcn for functional controls, the existing Magic UI Number Ticker/Bento adaptations and Animated List for presentation, and the installed Motion runtime where custom behavior needs it. No additional UI or animation dependencies.

Use finite 500ms section entrances, a finite 900ms decorative ring entrance, 150–350ms hover feedback and native smooth carousel navigation. Do not autoplay the carousel or loop dashboard effects. Content is server-rendered and all copy links remain available without JavaScript. Static values remain accessible throughout count animation. `prefers-reduced-motion` removes workspace animations, transforms/transitions and smooth scrolling immediately.

Verify keyboard navigation, focus restoration, both appearances, reduced motion, desktop fit, narrow layouts, zoom, empty states, failed images, native refresh and existing role/privacy behavior. No schema, authentication, authorization, catalog or business-logic change follows from this visual refresh.
