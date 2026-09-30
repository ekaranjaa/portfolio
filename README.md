# Emmanuel Karanja — Portfolio

This is the source for [ekaranja.me](https://ekaranja.me), my portfolio.

I'm a product developer: a UI/UX designer and software developer who designs and builds SaaS products, bringing together product thinking, user experience and engineering. I'm currently the Founder & CTO of [Elimu Bora](https://elimuboraerp.com), a school management platform for Kenyan schools. I've also worked as a full-stack web developer and UI/UX designer at Blue Book Publications, Chanl AI and SYNTAX.

- **Live site:** [ekaranja.me](https://ekaranja.me)
- **Design:** [Figma file](https://www.figma.com/design/nIIK4RzmJN7VihZ2PgO3PP/Portfolio)
- **Resume:** [PDF](https://ekaranja.me/documents/Emmanuel-Karanja-Resume.pdf)
- **Elsewhere:** [LinkedIn](https://linkedin.com/in/ekaranjaa) · [GitHub](https://github.com/ekaranjaa) · [X](https://x.com/ekaranjaa) · [Instagram](https://instagram.com/designs_by_karanja)
- **Email:** [karanjaemmanuel8@gmail.com](mailto:karanjaemmanuel8@gmail.com)

## What's on the page

It's a single page with these sections, in this order:

- **Hero:** my intro, with role tags that float and react to the cursor.
- **Services:** a scrolling marquee: UI/UX design, branding, prototyping, software development, AI integration, QA, CI/CD and SEO.
- **About:** who I am, and my go-to stack (Laravel, TypeScript, PostgreSQL and Tailwind CSS).
- **Experience:** my roles from 2020 to today, with a link to the full resume.
- **Work:** featured projects: Elimu Bora ERP, Sales Zote, Hovit, Mr Ticketz and Jahazi (coming soon).
- **Testimonials:** quotes from people I've worked with.
- **Contact:** the footer, with email and social links.

## Design

I designed the site in [Figma](https://www.figma.com/design/nIIK4RzmJN7VihZ2PgO3PP/Portfolio) first, with desktop (1440px) and mobile (393px) artboards, then built it to match.

The style is neo-brutalist: thick black borders, hard offset shadows, a yellow primary (`#f4c542`) and pink, blue and green accents. Headings and buttons use Lova Bold, and body text uses Space Grotesk. The design tokens are Tailwind theme variables in `src/styles/global.css`. Font sizes scale fluidly between the mobile and desktop artboards.

## Tech stack

- **[Astro 7](https://astro.build):** a fully static site.
- **[Vue 3](https://vuejs.org):** every section and UI component. The navbar and hero load straight away, and the experience and testimonials sections load when scrolled into view. The other sections render to plain HTML at build time.
- **[Tailwind CSS 4](https://tailwindcss.com):** styling, through the Vite plugin.
- **[GSAP](https://gsap.com):** the hero tag motion.
- **Astro Fonts API:** Space Grotesk from Fontsource, and Lova Bold self-hosted.
- **SEO:** a sitemap, a `robots.txt` endpoint, Open Graph and X cards, and JSON-LD structured data.
- **[PostHog](https://posthog.com):** analytics, on the live site only.
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/):** hosting, as static assets.

## Project structure

```text
/
├── public/                 # Images, favicons, the resume PDF and Cloudflare _headers
├── src/
│   ├── assets/fonts/       # Lova Bold
│   ├── components/         # Vue sections and UI components, plus the PostHog snippet
│   ├── data/portfolio.ts   # All site copy and links
│   ├── icons/              # SVG icons as Vue components
│   ├── layouts/            # BaseLayout, and Head for meta tags and structured data
│   ├── pages/              # index.astro and robots.txt
│   └── styles/global.css   # Tailwind and the theme tokens
├── astro.config.mjs
└── wrangler.jsonc          # Cloudflare deploy config
```

All of the copy lives in `src/data/portfolio.ts`: the hero, about text, jobs, projects, testimonials and links. The components read from it, so most content changes only touch that file. The About paragraphs are HTML strings, so they can contain `<strong>` and links.

## Running locally

You need Node 22.12 or later.

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

| Command                | Action                                  |
| :--------------------- | :-------------------------------------- |
| `npm run dev`          | Start the dev server                    |
| `npm run build`        | Build the site to `./dist/`             |
| `npm run preview`      | Preview the build locally               |
| `npm run format`       | Format everything with Prettier         |
| `npm run format:check` | Check formatting without changing files |

PostHog only runs on ekaranja.me, so nothing is tracked locally or on preview deployments. To build with analytics, copy `.env.example` to `.env` and set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. Without them, the build shows a warning and leaves PostHog off.

## Deployment

Cloudflare Workers Builds deploys the site from GitHub. `main` goes to ekaranja.me, and other branches get preview deployments. The site needs no adapter: `wrangler.jsonc` serves `./dist` as static assets. The PostHog variables are set as Cloudflare build variables. `public/_headers` lets browsers cache Astro's fingerprinted `/_astro/*` files forever.
