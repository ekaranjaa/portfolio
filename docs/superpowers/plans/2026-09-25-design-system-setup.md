# Design System & Tooling Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Tailwind CSS 4 and Vue to the Astro 7.3.5 portfolio using the documented commands. Encode the neo-brutalist Figma design as a Tailwind theme, with fonts loaded through the Astro Fonts API.

**Architecture:** Each integration is added with `npx astro add`. The design tokens live in one stylesheet, `src/styles/global.css` (Tailwind `@theme`), which the single layout `src/layouts/Layout.astro` imports. Fonts are declared in `astro.config.mjs` and rendered with `<Font />`, then mapped into Tailwind with `@theme inline`. There are no custom utilities: components use Tailwind's own class names.

**Tech Stack:** Astro 7.3.5, Tailwind CSS 4 (`@tailwindcss/vite`), Vue 3 (`@astrojs/vue`), Astro Fonts API (Fontsource and local providers), npm, Node ≥ 22.12.

**Spec:** `docs/superpowers/specs/2026-09-25-design-system-setup-design.md`

## Global Constraints

- Work on branch `feat/design-system-setup`. Every commit message ends with a blank line followed by `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Use the documented integration commands exactly: `npx astro add tailwind --yes` and `npx astro add vue --yes`. `--yes` is from `astro add --help`: "Accept all prompts".
- Tailwind names only. Don't add custom utilities, custom spacing/layout tokens or `@apply`. Only the tokens listed in spec §3 are allowed.
- The palette is closed (`--color-*: initial`), and so are shadows (`--shadow-*: initial`).
- Lova Bold is declared at weight `400`. Never give display text `font-bold`.
- Tailwind can't detect class names built at runtime (e.g. `` `bg-${c}` ``). Always write full class names in markup.
- Dev server: `npx astro dev --background`, managed with `npx astro dev status|logs|stop` (per CLAUDE.md).
- Indentation: `.astro` files use tabs. `astro.config.mjs` keeps whatever formatting `astro add` generates.
- `dist/` and `.astro/` are gitignored. Never commit build output.
- Build checks read `dist/index.html` plus every built `.css` file through `{ cat dist/index.html; find dist -name '*.css' -exec cat {} +; }`. Astro may inline small stylesheets into the HTML, and zsh aborts on a `*.css` glob that matches nothing.

## File Map

| File | Responsibility | Tasks |
|---|---|---|
| `src/components/Welcome.astro`, `src/assets/astro.svg`, `src/assets/background.svg` | Astro starter content: deleted | 1 |
| `src/pages/index.astro` | Home page: an empty `<Layout />` until components exist | 1 |
| `astro.config.mjs` | Vite plugin (Tailwind), integrations (Vue), fonts | 2, 3, 4 |
| `src/styles/global.css` | Tailwind import and all design tokens | 2, 4 |
| `src/layouts/Layout.astro` | Document shell: global CSS, `<Font />` tags, page background | 2, 4 |
| `package.json`, `package-lock.json` | Dependencies added by `astro add` | 2, 3 |
| `src/assets/fonts/LovaBold.otf` | Display font file (already on disk, untracked) | 4 |
| `src/pages/specimen.astro` | **Temporary** verification page, never committed | 5 |

---

### Task 1: Remove the Astro starter content

**Files:**
- Delete: `src/components/Welcome.astro`, `src/assets/astro.svg`, `src/assets/background.svg`
- Modify: `src/pages/index.astro` (whole file)

**Interfaces:**
- Consumes: nothing.
- Produces: `src/pages/index.astro` renders `<Layout />` with no children. Later tasks rely on this minimal page.

- [ ] **Step 1: Write the failing check**

This check passes only when no source file references the starter content:

```bash
grep -rnE "Welcome|astro\.svg|background\.svg" src && echo "FAIL: starter references remain" || echo "PASS"
```

- [ ] **Step 2: Run it to confirm it fails**

Run the command above.
Expected: `FAIL: starter references remain`, with matches listed in `src/pages/index.astro` and `src/components/Welcome.astro`.

- [ ] **Step 3: Delete the starter files and simplify the page**

```bash
git rm -q src/components/Welcome.astro src/assets/astro.svg src/assets/background.svg
```

Replace the whole of `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout />
```

- [ ] **Step 4: Run the check and a build to confirm they pass**

```bash
grep -rnE "Welcome|astro\.svg|background\.svg" src && echo "FAIL: starter references remain" || echo "PASS"
npx astro build
```

Expected: `PASS`, then the build ends with `Complete!` and no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -q -F - <<'EOF'
Remove Astro starter content

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Add Tailwind CSS and the theme tokens

**Files:**
- Modify (by command): `astro.config.mjs`, `package.json`, `package-lock.json`
- Create (by command, then overwrite): `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: the minimal `index.astro` from Task 1.
- Produces:
  - Tailwind utilities for: colours `primary`, `pink-accent`, `blue-accent`, `green-accent`, `white`, `black`, `github`, `linkedin`, `instagram`, `focus`; shadows `shadow-xs|sm|md|lg|xl`; tuned sizes `text-2xl|3xl|4xl|8xl`.
  - A base `:focus-visible` ring.
  - `Layout.astro` imports `../styles/global.css`, and `<body>` has `class="bg-primary/20"`.

- [ ] **Step 1: Write the failing check**

This check passes only when the built page uses a stylesheet that defines the brand primary colour. `body` uses `bg-primary/20`, so Tailwind emits `--color-primary`.

```bash
npx astro build >/dev/null 2>&1 && { cat dist/index.html; find dist -name '*.css' -exec cat {} +; } 2>/dev/null | grep -q -- "--color-primary:" && echo "PASS" || echo "FAIL: no --color-primary in build"
```

- [ ] **Step 2: Run it to confirm it fails**

Run the command above.
Expected: `FAIL: no --color-primary in build`.

- [ ] **Step 3: Run the documented Tailwind command**

```bash
npx astro add tailwind --yes
```

Expected:
- `astro.config.mjs` now imports `tailwindcss from '@tailwindcss/vite'` and has `vite: { plugins: [tailwindcss()] }`.
- `src/styles/global.css` exists containing `@import "tailwindcss";`.

Inspect with `git diff astro.config.mjs && cat src/styles/global.css`. Leave the generated config formatting as it is.

- [ ] **Step 4: Write the tokens into `src/styles/global.css`**

Replace the whole file with the following. The `@theme inline` font mapping is added in Task 4, together with the fonts.

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

@layer base {
  /* Focus/Blue ring for links and everything else; buttons opt out with outline-hidden */
  :focus-visible { outline: 4px solid var(--color-focus); outline-offset: 2px; }
}
```

- [ ] **Step 5: Wire the stylesheet into the layout**

Replace the whole of `src/layouts/Layout.astro` with the following. The starter's scoped `<style>` block is removed because Tailwind's preflight resets body margins.

```astro
---
import '../styles/global.css';
---

<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="icon" href="/favicon.ico" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro Basics</title>
	</head>
	<body class="bg-primary/20">
		<slot />
	</body>
</html>
```

- [ ] **Step 6: Run the check to confirm it passes**

```bash
npx astro build >/dev/null 2>&1 && { cat dist/index.html; find dist -name '*.css' -exec cat {} +; } 2>/dev/null | grep -q -- "--color-primary:" && echo "PASS" || echo "FAIL: no --color-primary in build"
```

Expected: `PASS`.

- [ ] **Step 7: Commit**

`package-lock.json` has been untracked since the starter install. Commit it now together with the new dependencies.

```bash
git add astro.config.mjs package.json package-lock.json src/styles/global.css src/layouts/Layout.astro
git commit -q -F - <<'EOF'
Add Tailwind CSS with neo-brutalist theme tokens

Installed via the documented `astro add tailwind`. The theme uses a
closed brand palette, hard offset shadows, and a fluid type scale
interpolated between the 393px and 1440px Figma artboards.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Add the Vue integration

**Files:**
- Modify (by command): `astro.config.mjs`, `package.json`, `package-lock.json`
- Temporary (created and deleted within this task): `src/components/VueProbe.vue`, an edit to `src/pages/index.astro`

**Interfaces:**
- Consumes: Tailwind from Task 2. The probe checks that Tailwind scans `.vue` files.
- Produces: `integrations: [vue()]` in `astro.config.mjs`. `.vue` components can be rendered from `.astro` files.

- [ ] **Step 1: Write the failing check: a temporary Vue component**

Create `src/components/VueProbe.vue`:

```vue
<template>
	<p class="text-3xl font-bold">vue-probe-ok</p>
</template>
```

Replace `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import VueProbe from '../components/VueProbe.vue';
---

<Layout>
	<VueProbe />
</Layout>
```

- [ ] **Step 2: Run the build to confirm it fails**

```bash
npx astro build
```

Expected: the build fails. With no Vue renderer, Astro can't import or render the `.vue` component. The exact message varies; a non-zero exit is the signal.

- [ ] **Step 3: Run the documented Vue command**

```bash
npx astro add vue --yes
```

Expected: `@astrojs/vue` and `vue` appear in `package.json`, and `astro.config.mjs` imports `vue from '@astrojs/vue'` and has `integrations: [vue()]`. Check with `git diff astro.config.mjs package.json`. Don't set any integration options.

- [ ] **Step 4: Run the build and check to confirm they pass**

```bash
npx astro build && grep -q "vue-probe-ok" dist/index.html && { cat dist/index.html; find dist -name '*.css' -exec cat {} +; } 2>/dev/null | grep -qE '\.text-3xl\s*\{' && echo "PASS" || echo "FAIL"
```

Expected: `PASS`. This means the Vue component was server-rendered and Tailwind generated a `.text-3xl { … }` rule from the `.vue` file. The pattern matches the CSS selector, not the class attribute in the HTML.

- [ ] **Step 5: Remove the probe and restore the page**

```bash
rm src/components/VueProbe.vue
```

Replace `src/pages/index.astro` with the Task 1 version:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout />
```

Then confirm that only the intended files changed:

```bash
npx astro build >/dev/null && git status --short
```

Expected: only ` M astro.config.mjs`, ` M package.json` and ` M package-lock.json` (plus `?? src/assets/fonts/`, which is committed in Task 4).

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -q -F - <<'EOF'
Add Vue integration

Installed via the documented `astro add vue`.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Load the fonts with the Astro Fonts API

**Files:**
- Modify: `astro.config.mjs` (the `astro/config` import line and a new `fonts` key)
- Modify: `src/layouts/Layout.astro` (frontmatter and `<head>`)
- Modify: `src/styles/global.css` (append the `@theme inline` block)
- Add to git: `src/assets/fonts/LovaBold.otf` (already on disk)

**Interfaces:**
- Consumes: `global.css` and `Layout.astro` from Task 2, and the config from Tasks 2 and 3.
- Produces:
  - CSS variables `--font-space-grotesk` and `--font-lova`.
  - Tailwind utilities `font-sans` (the page default, Space Grotesk 400/500/700) and `font-display` (Lova Bold 400).

- [ ] **Step 1: Write the failing check**

This check passes only when the built page has `@font-face` rules, both font variables, a Space Grotesk woff2 file and the Lova OTF file.

```bash
npx astro build >/dev/null 2>&1 \
  && H=$({ cat dist/index.html; find dist -name '*.css' -exec cat {} +; } 2>/dev/null) \
  && echo "$H" | grep -q "@font-face" \
  && echo "$H" | grep -q -- "--font-space-grotesk" \
  && echo "$H" | grep -q -- "--font-lova" \
  && echo "$H" | grep -qE "format\(.opentype.\)" \
  && [ -n "$(find dist -name '*.woff2' | head -1)" ] \
  && [ -n "$(find dist -name '*.otf' | head -1)" ] \
  && echo "PASS" || echo "FAIL: fonts not wired"
```

- [ ] **Step 2: Run it to confirm it fails**

Run the command above.
Expected: `FAIL: fonts not wired`.

- [ ] **Step 3: Declare the fonts in `astro.config.mjs`**

Change the import line from:

```js
import { defineConfig } from 'astro/config';
```

to:

```js
import { defineConfig, fontProviders } from 'astro/config';
```

Add a `fonts` key to the object passed to `defineConfig`, next to the existing `vite` and `integrations` keys. Leave those keys unchanged.

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
  ],
```

The whole file should now look like this. Key order and blank lines may differ depending on what `astro add` generated.

```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [vue()],

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
  ],
});
```

- [ ] **Step 4: Render the fonts in the layout**

In `src/layouts/Layout.astro`, change the frontmatter to:

```astro
---
import { Font } from 'astro:assets';
import '../styles/global.css';
---
```

In `<head>`, add these two lines directly before `<title>`:

```astro
		<Font cssVariable="--font-space-grotesk" preload />
		<Font cssVariable="--font-lova" preload />
```

- [ ] **Step 5: Map the fonts into Tailwind**

Add this block to `src/styles/global.css`, between the closing `}` of `@theme { … }` and `@layer base`:

```css
@theme inline {
  --font-sans: var(--font-space-grotesk);
  --font-display: var(--font-lova);
}
```

- [ ] **Step 6: Run the check to confirm it passes**

Run the Step 1 command again.
Expected: `PASS`. If the build fails because Fontsource can't be reached, that's a network problem, not a config problem. Re-run once the network is available.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs src/layouts/Layout.astro src/styles/global.css src/assets/fonts/LovaBold.otf
git commit -q -F - <<'EOF'
Load Space Grotesk and Lova Bold via the Astro Fonts API

Space Grotesk comes from Fontsource (400/500/700, normal only) and is
mapped to font-sans so it is the page default. Lova Bold is a local OTF
declared at weight 400, matching the file, and mapped to font-display.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 5: Verify the design system in the browser (temporary specimen)

This task is verification only, and nothing from it is committed. It needs browser automation (Claude in Chrome: navigate, JavaScript, mouse, keyboard and screenshots). **Run it inline in the controlling session**, not in a subagent that lacks browser tools.

**Files:**
- Temporary: `src/pages/specimen.astro` (created, then deleted)

**Interfaces:**
- Consumes: every token, class and font from Tasks 2–4.
- Produces: a pass/fail verification report. The working tree ends clean.

- [ ] **Step 1: Create the specimen page**

Create `src/pages/specimen.astro`. Every class is written out in full so that Tailwind detects it.

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
	<main class="container mx-auto px-6 py-10 flex flex-col gap-10">
		<h1 data-text="8xl" class="font-display text-8xl">Product developer</h1>
		<p data-text="4xl" class="font-display text-4xl">Let’s talk</p>
		<p data-text="3xl" class="text-3xl font-bold">Subhead 32 bold</p>
		<p data-text="2xl" class="text-2xl">Body copy that is 20px on mobile and 24px on desktop.</p>
		<p class="text-2xl font-medium">Nav link medium</p>
		<p class="text-xl">Card body 20</p>
		<p class="text-base font-bold leading-tight">Tag 16 bold</p>

		<div class="flex flex-wrap gap-6">
			<div data-color="primary" class="size-20 border-4 border-black bg-primary"></div>
			<div data-color="pink-accent" class="size-20 border-4 border-black bg-pink-accent"></div>
			<div data-color="blue-accent" class="size-20 border-4 border-black bg-blue-accent"></div>
			<div data-color="green-accent" class="size-20 border-4 border-black bg-green-accent"></div>
			<div data-color="white" class="size-20 border-4 border-black bg-white"></div>
			<div data-color="black" class="size-20 border-4 border-black bg-black"></div>
			<div data-color="github" class="size-20 border-4 border-black bg-github"></div>
			<div data-color="linkedin" class="size-20 border-4 border-black bg-linkedin"></div>
			<div data-color="instagram" class="size-20 border-4 border-black bg-instagram"></div>
			<div data-color="focus" class="size-20 border-4 border-black bg-focus"></div>
			<div id="palette-probe" class="size-20 bg-red-500"></div>
		</div>

		<div class="flex flex-wrap gap-10">
			<div data-shadow="xs" class="size-20 border-2 border-black rounded-lg bg-white shadow-xs"></div>
			<div data-shadow="sm" class="size-20 border-4 border-black rounded-xl bg-white shadow-sm"></div>
			<div data-shadow="md" class="size-20 border-4 border-black rounded-xl bg-white shadow-md"></div>
			<div data-shadow="lg" class="size-20 border-8 border-black rounded-t-full bg-pink-accent shadow-lg"></div>
			<div data-shadow="xl" class="size-20 border-8 border-black rounded-3xl bg-primary shadow-xl"></div>
		</div>

		<a id="specimen-link" href="#" class="text-2xl text-blue-accent font-bold underline">Text link</a>
		<button id="specimen-button" type="button" class="self-start font-display text-4xl border-4 border-black rounded-xl px-6 py-3 bg-primary text-black shadow-md outline-hidden transition hover:bg-blue-accent hover:shadow-sm focus-visible:bg-blue-accent focus-visible:shadow-sm">Let’s talk</button>
	</main>
</Layout>
```

- [ ] **Step 2: Start the dev server**

```bash
npx astro dev --background && npx astro dev status
```

Expected: the status output reports a running server and its URL (default `http://localhost:4321/`). If it isn't running, read `npx astro dev logs`.

- [ ] **Step 3: Check the fonts, colours, palette reset and shadows**

Open `http://localhost:4321/specimen` in a new browser tab and run:

```js
(async () => {
  await document.fonts.ready;
  const cs = (sel) => getComputedStyle(document.querySelector(sel));
  return {
    loadedFonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
    bodyFont: getComputedStyle(document.body).fontFamily,
    displayFont: cs('[data-text="8xl"]').fontFamily,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    primary: cs('[data-color="primary"]').backgroundColor,
    focusColor: cs('[data-color="focus"]').backgroundColor,
    paletteProbe: cs('#palette-probe').backgroundColor,
    shadows: Object.fromEntries(['xs', 'sm', 'md', 'lg', 'xl'].map((s) => [s, cs(`[data-shadow="${s}"]`).boxShadow])),
  };
})()
```

Expected:
- `loadedFonts`:
  - includes Space Grotesk at 400, 500 and 700, and Lova Bold at 400
  - the family names may carry an Astro suffix, but they must be the real fonts, not only fallbacks
- `bodyFont` starts with the Space Grotesk family, and `displayFont` starts with the Lova Bold family.
- `bodyBg` is primary at 20% alpha, roughly `color(srgb 0.957 0.773 0.259 / 0.2)` or an `oklab(… / 0.2)` equivalent.
- `primary` is `rgb(244, 197, 66)`.
- `focusColor` is `rgb(73, 117, 233)`.
- `paletteProbe` is `rgba(0, 0, 0, 0)`. `bg-red-500` generated nothing, which proves the default palette is gone.
- `shadows`: `xs` → `rgb(0, 0, 0) 2px 2px 0px 0px`, `sm` → `4px 4px`, `md` → `6px 6px`, `lg` → `8px 8px`, `xl` → `12px 12px`.

- [ ] **Step 4: Check that the fluid type hits the artboard values**

Run this on the same page. It loads the specimen into offscreen iframes 393px and 1440px wide, so `vw` resolves to those widths.

```js
(async () => {
  const measure = (w) => new Promise((resolve) => {
    const f = document.createElement('iframe');
    f.style.cssText = `width:${w}px;height:800px;border:0;position:absolute;left:-99999px;top:0`;
    f.src = '/specimen';
    f.onload = () => {
      const d = f.contentDocument;
      const px = (sel) => parseFloat(getComputedStyle(d.querySelector(sel)).fontSize).toFixed(1);
      resolve({ viewport: w, '2xl': px('[data-text="2xl"]'), '3xl': px('[data-text="3xl"]'), '4xl': px('[data-text="4xl"]'), '8xl': px('[data-text="8xl"]') });
      f.remove();
    };
    document.body.append(f);
  });
  return [await measure(393), await measure(1440)];
})()
```

Expected (±0.1px):
- 393px: `{ 2xl: 20.0, 3xl: 32.0, 4xl: 32.0, 8xl: 98.0 }`
- 1440px: `{ 2xl: 24.0, 3xl: 32.0, 4xl: 40.0, 8xl: 112.0 }`

- [ ] **Step 5: Check the button and focus states**

1. Move the mouse over `#specimen-button` (real hover, using the browser tool), then run:
   ```js
   (() => { const s = getComputedStyle(document.querySelector('#specimen-button')); return [s.backgroundColor, s.boxShadow]; })()
   ```
   Expected: `rgb(70, 124, 209)` and a shadow of `rgb(0, 0, 0) 4px 4px 0px 0px`. Take a screenshot as evidence.
2. Move the mouse away. Click an empty area of the page, then press `Tab` until `#specimen-link` is focused, and run:
   ```js
   (() => { const s = getComputedStyle(document.activeElement); return [document.activeElement.id, s.outlineStyle, s.outlineWidth, s.outlineColor]; })()
   ```
   Expected: `specimen-link`, `solid`, `4px`, `rgb(73, 117, 233)`.
3. Press `Tab` once more to focus `#specimen-button`, and run:
   ```js
   (() => { const s = getComputedStyle(document.activeElement); return [document.activeElement.id, s.backgroundColor, s.boxShadow, s.outlineStyle]; })()
   ```
   Expected: `specimen-button`, `rgb(70, 124, 209)`, a shadow of `rgb(0, 0, 0) 4px 4px 0px 0px`, and `none`.
4. Take a full-page screenshot of the specimen at the default width as visual evidence of Lova, Space Grotesk, the swatches and the shadows.

- [ ] **Step 6: Clean up and confirm the tree is clean**

```bash
npx astro dev stop
rm src/pages/specimen.astro
npx astro build >/dev/null && git status --short
```

Expected: the dev server stops, the build passes, and `git status --short` prints nothing.

- [ ] **Step 7: Report**

Summarise the results of Steps 3–5, listing each expected value against the actual one. Flag any mismatch rather than fixing tokens silently. A token change goes back to the spec first.
