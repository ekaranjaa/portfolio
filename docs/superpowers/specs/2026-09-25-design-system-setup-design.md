# Design system & tooling setup — Design

- **Date:** 2026-09-25
- **Status:** Approved in brainstorming, awaiting spec review
- **Figma:** https://www.figma.com/design/nIIK4RzmJN7VihZ2PgO3PP/Portfolio (desktop `2:14` @ 1440px, mobile `20:2115` @ 393px)

## Goal

Add Tailwind CSS and Vue to the fresh Astro 7.3.5 project, following the official Astro documentation (including its commands), and encode the neo-brutalist Figma design as a Tailwind theme so that components can be built next.

## Scope

**In scope:** Tailwind and Vue integrations, fonts (Astro Fonts API), theme tokens in `src/styles/global.css`, layout wiring, removal of the Astro starter content, and verification.

**Out of scope:** Page sections and components (nav, hero, marquee, cards, and so on). This spec records only the conventions those components will follow.

## Guiding principles

1. **Follow the docs.** Use Astro's documented commands and config shapes. Where Tailwind's docs define a pattern (namespaces, `@theme inline`, `container`), use it.
2. **Use Tailwind's names.** Tune Tailwind's existing scales rather than inventing class names. Only add a name where Tailwind has none (brand colours, `font-display`).
3. **Apply classes directly.** Don't add custom spacing or layout utilities. Use Tailwind's numeric classes with breakpoint variants in markup (for example `pt-10 pb-10 lg:pb-20`).

## 1. Tooling

Run the documented commands from the project root. The `--yes` flag comes from `astro add --help` ("Accept all prompts") and is needed only because the agent shell can't answer interactive prompts.

| Step | Command | Documented result |
|---|---|---|
| Tailwind | `npx astro add tailwind --yes` | `@tailwindcss/vite` added to `vite.plugins` in `astro.config.mjs`; `src/styles/global.css` created with `@import "tailwindcss";` |
| Vue | `npx astro add vue --yes` | `@astrojs/vue` and `vue` installed; `integrations: [vue()]` |

Leave the Vue options (`appEntrypoint`, `devtools`, `jsx`) unset until a component needs them. Vue SFCs use Tailwind classes directly and avoid `@apply`.

## 2. Fonts (Astro Fonts API, stable in Astro 7)

Add to `astro.config.mjs` (import `fontProviders` from `astro/config`):

```js
fonts: [
  {
    provider: fontProviders.fontsource(),
    name: "Space Grotesk",
    cssVariable: "--font-space-grotesk",
    weights: [400, 500, 700],
    styles: ["normal"],
  },
  {
    provider: fontProviders.local(),
    name: "Lova Bold",
    cssVariable: "--font-lova",
    options: {
      variants: [{ src: ["./src/assets/fonts/LovaBold.otf"], weight: 400, style: "normal" }],
    },
  },
]
```

- **Space Grotesk** (body and headings) is on Fontsource. The design uses weights 400 (body), 500 (nav) and 700 (tags, subheads, inline emphasis). `styles: ["normal"]` overrides the default, which also includes italic; the design never uses italic.
- **Lova Bold** (display) is `src/assets/fonts/LovaBold.otf` by Nirmana Visual. The file's internal family is "Lova Bold", style Regular, `usWeightClass` 400. It is declared at 400 so browsers never synthesise a faux bold. Display text must not be given `font-bold`.
- **OTF support:** the docs' examples only show woff2/woff, but Astro 7.3.5's local provider accepts `.otf` (`FONT_FORMATS` maps it to `format("opentype")`, and local sources aren't filtered by `formats`). The file is 23 KB and stays as OTF.
- **Fallbacks** use the Astro default (`sans-serif`, with optimised fallback metrics generated).

## 3. Theme tokens: `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --color-primary: #f4c542;
  --color-pink-accent: #e054b6;
  --color-blue-accent: #467cd1;
  --color-green-accent: #166b51;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-github: #000000;
  --color-linkedin: #0b66c2;
  --color-instagram: #dd2a7b;
  --color-focus: #4975e9;

  --shadow-*: initial;
  --shadow-xs: 2px 2px 0 0 #000;    /* tags */
  --shadow-sm: 4px 4px 0 0 #000;    /* button hover/focus */
  --shadow-md: 6px 6px 0 0 #000;    /* buttons */
  --shadow-lg: 8px 8px 0 0 #000;    /* hero arch */
  --shadow-xl: 12px 12px 0 0 #000;  /* cards */

  /* Fluid between the 393px and 1440px artboards */
  --text-2xl: clamp(1.25rem, 1.1562rem + 0.3820vw, 1.5rem);   /* 20 → 24 */
  --text-2xl--line-height: 1.4;
  --text-3xl: 2rem;                                             /* 32 */
  --text-3xl--line-height: 1.4;
  --text-4xl: clamp(2rem, 1.8123rem + 0.7641vw, 2.5rem);       /* 32 → 40 */
  --text-4xl--line-height: 1.4;
  --text-8xl: clamp(6.125rem, 5.7966rem + 1.3372vw, 7rem);     /* 98 → 112 */
}

@theme inline {
  --font-sans: var(--font-space-grotesk);
  --font-display: var(--font-lova);
}

@layer base {
  /* Focus/Blue ring for links and everything else; buttons opt out with outline-hidden */
  :focus-visible { outline: 4px solid var(--color-focus); outline-offset: 2px; }
}
```

### Rationale

- **Colours.** The palette is closed, so Tailwind's default colours are removed (`--color-*: initial`). Only brand utilities exist. `focus` comes from the Figma variable `Focus/Blue`. The page background is not a token; it is `bg-primary/20`, which matches the Figma cream (≈ `#FDF3D9`). If a component later needs a grey, add a token for it.
- **Shadows.** Neo-brutalist shadows are hard (no blur), black and offset. Tailwind's soft defaults are removed and its own names are reused for the five offsets used in the design.
- **Fluid type.** This follows GitLab Pajamas' method: `clamp(min, rem + vw, max)`, linear between two viewports, with rem bounds so browser font-size settings still apply. The viewports are the Figma artboards (393px → 1440px), so each step lands exactly on the mobile and desktop design values and holds them outside that range. The formulas are: `slope = (max − min) / (1440 − 393)` and `intercept = min − slope × 393`.
- **Unchanged Tailwind defaults.** These already match Figma:
  - `text-base` (16) and `text-xl` (20 at 1.4)
  - radii `rounded-lg` / `rounded-xl` / `rounded-3xl` / `rounded-full` (8 / 12 / 24 / pill)
  - borders `border-2` / `border-4` / `border-8`
  - the spacing scale (every Figma spacing value is a multiple of 4px)
- **`font-sans` mapping.** Mapping `--font-sans` makes Space Grotesk the page default through Tailwind's preflight, so body text needs no class.
- **Fluid type only.** Spacing is deliberately not fluid. It uses breakpoint variants (principle 3). A fluid base `--spacing` would also shrink button padding and icon sizes, which Figma keeps constant.

## 4. Layout wiring: `src/layouts/Layout.astro`

- Import `../styles/global.css` in the frontmatter.
- Import `{ Font }` from `astro:assets` and add `<Font cssVariable="--font-space-grotesk" preload />` and `<Font cssVariable="--font-lova" preload />` in `<head>`. Both fonts appear above the fold.
- `<body class="bg-primary/20">`.
- Remove the starter's scoped `<style>` block. Preflight resets margins, and nothing needs `height: 100%`.

## 5. Starter cleanup

- Delete `src/components/Welcome.astro`, `src/assets/astro.svg` and `src/assets/background.svg`.
- `src/pages/index.astro` renders an empty `<Layout>`, ready for components.

## 6. Conventions for the component phase

**Page width:** `container mx-auto px-6` on every section's inner wrapper.
- Tailwind v4's `container` has no centring or padding of its own.
- `px-6` applies at every size, because the container's max-width equals each breakpoint width and content would touch the edges at exactly those widths.
- At 1440px the content is 1232px wide (Figma: 1198px). This is an accepted difference.

**Responsive switch point:** `lg`, unless a component needs another.

### Figma → Tailwind reference

| Figma (mobile → desktop) | Classes |
|---|---|
| Display, Lova 98 → 112 | `font-display text-8xl` |
| CTA label, Lova 32 → 40 | `font-display text-4xl` |
| Nav CTA label, Lova 32 | `font-display text-3xl` |
| Body, 20 → 24 / 1.4 | `text-2xl` |
| Card body, 20 / 1.4 | `text-xl` |
| Subhead, 32 bold / 1.4 | `text-3xl font-bold` |
| Nav link, 24 medium | `text-2xl font-medium` |
| Tag, 16 bold, normal leading | `text-base font-bold leading-tight` |
| Section padding, 40 → 40/80 | e.g. `pt-10 pb-10 lg:pb-20` (some desktop sections use `lg:pt-20`) |
| Gap between blocks, 24 → 40 | `gap-6 lg:gap-10` |
| Card padding, 24 → 40 | `p-6 lg:p-10` |
| Button padding, 12 / 24 | `px-6 py-3` |
| Tag padding, 8 / 12 | `px-3 py-2` |
| Button | `border-4 border-black rounded-xl shadow-md` |
| Tag | `border-2 border-black rounded-lg shadow-xs` |
| Card | `border-8 border-black rounded-3xl shadow-xl` |
| Hero arch | `border-8 border-black rounded-t-full shadow-lg` |
| Nav bottom rule | `border-b-8 border-black` |

### Button states

```
bg-primary text-black shadow-md outline-hidden transition
hover:bg-blue-accent hover:shadow-sm
focus-visible:bg-blue-accent focus-visible:shadow-sm
```

- Hover and focus both change the background to `blue-accent` and collapse the shadow from 6px to 4px. The button does not move.
- Text stays black (5.1:1 on `blue-accent`, which passes WCAG AA).
- The outline is always hidden. `outline-hidden` keeps a transparent outline, so a focus ring still appears in forced-colours (high-contrast) mode.
- Tailwind v4 applies `hover:` only on devices that support hover. `focus-visible:` covers keyboard users.

### Marquee

- No token. Its height comes from `py-6` plus its text size.
- Mobile: 24px text, 8px squares, 16px gap. Desktop: 40px text, 16px squares, 40px gap.
- These are expressed with breakpoint variants when the marquee is built.

## 7. Verification

1. `npx astro build` succeeds.
2. The built CSS in `dist/` contains:
   - the theme tokens, and no default palette (for example, no `--color-red-500`)
   - `@font-face` rules for Space Grotesk (woff2; 400, 500 and 700) and Lova Bold (`format("opentype")`)
3. Dev server started with `astro dev --background` (per CLAUDE.md).
4. A temporary specimen shows colours, shadows, type and the button states. In the browser, check that:
   - both fonts render as the real fonts, not fallbacks
   - `text-8xl` measures 98px at a 393px viewport and 112px at 1440px
5. Delete the specimen afterwards and stop the dev server (`astro dev stop`).
