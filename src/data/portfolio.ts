import { markRaw } from 'vue'
import GithubIcon from '@/icons/GithubIcon.vue'
import LinkedinIcon from '@/icons/LinkedinIcon.vue'
import InstagramIcon from '@/icons/InstagramIcon.vue'

export interface Link {
    label: string
    href: string
}

export interface Social extends Link {
    /** Doubles as the Button colour, so each social button wears its brand colour. */
    id: 'github' | 'linkedin' | 'instagram'
    icon: object
}

export interface HeroTag {
    label: string
    color: 'pink-accent' | 'blue-accent' | 'green-accent'
}

export interface StackItem {
    name: string
    description: string
}

export interface Job {
    role: string
    company: string
    period: string
    description: string
    technologies: string[]
}

export interface Project {
    name: string
    description: string
    /** Omit it and the card shows the coming-soon label instead of a button. */
    href?: string
    /** The project's brand colour, applied to its card as an inline background. */
    color: string
    /** Dark cards set their text in white. */
    dark: boolean
    /** The device mockup exported from the design, on a transparent background. */
    image: { src: string; alt: string }
}

export interface Testimonial {
    name: string
    title: string
    date: string
    relationship: string
    /** One entry per paragraph. */
    quote: string[]
}

const email = 'karanjaemmanuel8@gmail.com'

/** Every "Let's talk" button except the footer's scrolls to the contact footer. */
const letsTalk: Link = { label: 'Let’s talk', href: `mailto:${email}` }

/** Project sites, shared by the project cards and the links in the About copy. */
const projectUrls = {
    elimuBora: 'https://elimuboraerp.com',
    salesZote: 'https://saleszote.com',
    hovit: 'https://hovit.co.ke',
    mrTicketz: 'https://mrticketz.com',
}

/**
 * An inline project link for the HTML paragraphs. It opens in a new tab and carries the same
 * PostHog labels as the project buttons.
 */
const externalLink = (label: string, href: string) =>
    `<a href="${href}" target="_blank" rel="noopener" data-ph-capture-attribute-link_type="project" data-ph-capture-attribute-placement="about" data-ph-capture-attribute-project_name="${label}">${label}</a>`

/** A footer credit link to the public design file or source code. It opens in a new tab. */
const creditLink = (label: string, href: string) =>
    `<a href="${href}" target="_blank" rel="noopener" data-ph-capture-attribute-link_type="credit" data-ph-capture-attribute-placement="footer">${label}</a>`

export const portfolio = {
    site: {
        name: 'Emmanuel Karanja',
        title: 'Emmanuel Karanja — Product Developer',
        description:
            'UI/UX Designer and Software Developer who designs and builds SaaS products, bringing together product thinking, user experience, and engineering.',
        keywords: [
            'Ekaranja',
            'Emmanuel Karanja',
            'Product Developer',
            'Software Developer',
            'Software Engineer',
            'Full Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'Laravel Developer',
            'Vue.js Developer',
            'UI/UX Designer',
            'Product Designer',
        ],
        /** HTML: "Designed" links to the Figma file and "built" to the GitHub repo. */
        credit: `${creditLink('Designed', 'https://www.figma.com/design/nIIK4RzmJN7VihZ2PgO3PP/Portfolio?node-id=0-1&t=muMxdEiN4GlMEpj9-1')} & ${creditLink('built', 'https://github.com/ekaranjaa/portfolio')} by Emmanuel Karanja.`,
        email,
        /** Not one of the social buttons; it credits X cards and joins the structured data. */
        x: { handle: '@ekaranjaa', href: 'https://x.com/ekaranjaa' },
        locale: 'en_KE',
        /** The page background (primary at 20% over white), so the browser chrome blends in. */
        themeColor: '#fdf3d9',
        /** The link-preview card for social shares, at the 1200×630 Open Graph expects. */
        ogImage: {
            src: '/images/cover.png',
            alt: 'Emmanuel Karanja, Product Developer',
            width: 1200,
            height: 630,
        },
    },

    navigation: {
        links: [
            { label: 'About', href: '#about' },
            { label: 'Experience', href: '#experience' },
            { label: 'Work', href: '#work' },
            { label: 'Testimonials', href: '#testimonials' },
        ] satisfies Link[],
        cta: letsTalk,
    },

    hero: {
        greeting: 'Hi, my name is Emmanuel Karanja and I’m a',
        title: 'Product Developer',
        description:
            'I design and build digital products; bringing together product thinking, user experience, and engineering to turn ideas into useful, well-crafted software.',
        image: { src: '/images/hero.webp', alt: 'Emmanuel Karanja' },
        tags: [
            { label: 'UI/UX Designer', color: 'pink-accent' },
            { label: 'Software Developer', color: 'blue-accent' },
            { label: 'Available for consultation', color: 'green-accent' },
        ] satisfies HeroTag[],
        cta: letsTalk,
    },

    /** The scrolling marquee under the hero. */
    services: [
        'UI/UX Design',
        'Branding',
        'Prototyping',
        'Software Development',
        'AI Integration',
        'QA',
        'CI/CD',
        'SEO',
    ],

    about: {
        heading: 'Get to know me',
        /** Paragraphs are HTML, rendered with v-html, so they can carry <strong> and <a>. */
        paragraphs: [
            'Hi, I’m Emmanuel. I’m a <strong>product designer and software engineer</strong> who enjoys turning ideas into digital products, working at the intersection of design and engineering where I can think about how something should work, how it should feel, and then actually build it.',
            `I’m currently the Founder & CTO of Elimu Bora, where I’ve taken our school management platform from an idea to a production SaaS product, working across product, design, engineering, and everything in between. I’ve also designed products like ${externalLink('Sales Zote', projectUrls.salesZote)}, ${externalLink('Mr Ticketz', projectUrls.mrTicketz)} and ${externalLink('Hovit', projectUrls.hovit)}.`,
            'Outside of work, I’m usually exploring new ideas, experimenting with technology, working on side projects, or trying to make whatever I’m building a little better than it was yesterday.',
        ],
    },

    stack: {
        heading: 'My go-to stack',
        description:
            'I’m largely stack-agnostic and choose the tools that best fit the product, team, and problem at hand. That said, these are the technologies I reach for most often and where I’m most comfortable building.',
        items: [
            {
                name: 'Laravel',
                description:
                    'I use Laravel to build web applications and APIs, handling everything from application logic and authentication to background jobs and integrations.',
            },
            {
                name: 'TypeScript',
                description:
                    'I use TypeScript to build polished, interactive user experiences with frameworks like React, Vue, Svelte, and Angular, while also building AI integrations such as RAG systems, embeddings, vector search, and other AI-powered features.',
            },
            {
                name: 'PostgreSQL',
                description:
                    'I use PostgreSQL as my primary relational database, taking advantage of features like Row Level Security and pgvector for secure, multi-tenant applications and vector search.',
            },
            {
                name: 'Tailwind CSS',
                description:
                    'I use Tailwind CSS to build responsive interfaces quickly while keeping styling consistent, maintainable, and closely aligned with the design system.',
            },
        ] satisfies StackItem[],
    },

    experience: {
        heading: 'Where I’ve worked',
        resume: {
            label: 'View full resume',
            href: '/documents/Emmanuel-Karanja-Resume.pdf',
        } satisfies Link,
        jobs: [
            {
                role: 'Founder & CTO',
                company: 'Elimu Bora Solutions Ltd',
                period: 'Oct 2025 - Present',
                description:
                    'Built Elimu Bora ERP from the ground up, owning product strategy, UI/UX, engineering, and go-to-market. Architected the multi-tenant SaaS platform and shipped core school workflows covering academics, finance, attendance, and parent engagement.',
                technologies: ['Laravel', 'TypeScript', 'Vue.js', 'PostgreSQL', 'Figma'],
            },
            {
                role: 'Full Stack Web Developer & UI/UX Designer',
                company: 'Blue Book Publications, Inc.',
                period: 'Jul 2023 - Jan 2026',
                description:
                    'Led product design and development for a platform serving 250k+ registered users. Redesigned core experiences, increasing conversion and engagement by 30%, improved search with Algolia, and shipped a new marketplace feature.',
                technologies: ['Laravel', 'Vue.js', 'MySQL', 'Algolia', 'Figma'],
            },
            {
                role: 'Full Stack Web Developer & UI/UX Designer',
                company: 'Chanl AI',
                period: 'Feb 2023 - Jun 2023',
                description:
                    'Worked directly with the founders to shape the product and deliver rapid iterations that helped onboard the company’s first three paying clients. Led frontend development while contributing to backend services and product UX.',
                technologies: ['NestJS', 'Typescript', 'Angular', 'MySQL', 'Figma'],
            },
            {
                role: 'Full Stack Web Developer & UI/UX Designer',
                company: 'SYNTAX LTD',
                period: 'May 2021 - Feb 2023',
                description:
                    'Designed and built products across fintech, real estate, NFTs, gaming, and logistics, including a finance app serving 20k+ users. Owned UI/UX on several products while contributing to Laravel backend development, SEO, and performance.',
                technologies: ['Laravel', 'Vue.js', 'MySQL', 'Figma'],
            },
            {
                role: 'IT Intern',
                company: 'The Dream Factory Kenya',
                period: 'Feb 2020 - May 2020',
                description:
                    'Supported database development, frontend implementation, UI prototyping, and SEO across client projects while working alongside the engineering team.',
                technologies: ['Laravel', 'Vue.js', 'MySQL'],
            },
        ] satisfies Job[],
    },

    projects: {
        heading: 'My featured work',
        cta: 'View project',
        comingSoon: 'Coming soon!',
        items: [
            {
                name: 'Elimu Bora ERP',
                image: {
                    src: '/images/projects/elimu-bora.webp',
                    alt: 'Elimu Bora ERP on a laptop and a phone',
                },
                description:
                    'Elimu Bora ERP is a school management platform built for Kenyan schools, bringing academics, attendance, fees, inventory, and parent communication together in one system.',
                href: projectUrls.elimuBora,
                color: '#880000',
                dark: true,
            },
            {
                name: 'Sales Zote',
                image: {
                    src: '/images/projects/sales-zote.webp',
                    alt: 'Sales Zote app screens on two phones',
                },
                description:
                    'Sales Zote is a cloud-based POS and inventory management system built to streamline operations for retail, wholesale, and growing chain businesses.',
                href: projectUrls.salesZote,
                color: '#fdba1b',
                dark: false,
            },
            {
                name: 'Hovit',
                image: {
                    src: '/images/projects/hovit.webp',
                    alt: 'Hovit app screens on two phones',
                },
                description:
                    'Hovit is a feature-rich house-hunting app designed to simplify every step of the renting journey. It entails 4 platforms; Hovit App, H Agent App and H Mover App and a web platform.',
                href: projectUrls.hovit,
                color: '#059669',
                dark: true,
            },
            {
                name: 'Mr Ticketz',
                image: {
                    src: '/images/projects/mr-ticketz.webp',
                    alt: 'Mr Ticketz app screens on two phones',
                },
                description:
                    'MR TICKETZ is a modern ticketing platform with a dedicated mobile app designed specifically for event promoters.',
                href: projectUrls.mrTicketz,
                color: '#dc2626',
                dark: true,
            },
            {
                name: 'Jahazi',
                image: {
                    src: '/images/projects/jahazi.webp',
                    alt: 'Jahazi app screens on two phones',
                },
                description:
                    'JAHAZI is a mobile-first lending platform designed to offer accessible, transparent borrowing solutions in regions underserved by traditional financial systems.',
                color: '#f4c542',
                dark: false,
            },
        ] satisfies Project[],
    },

    testimonials: {
        /** Set around the rotating badge beside the quotes. */
        heading: 'People I’ve worked with',
        label: 'Testimonials',
        items: [
            {
                name: 'Julian Gums',
                title: 'CTO at Flinq',
                date: 'October 3, 2025',
                relationship: 'Julian managed Emmanuel directly',
                quote: [
                    "Emmanuel just gets it! He breaks down complex challenges with ease and always strives for the sleekest user experience possible. He doesn't just design beautiful UIs in no time but also implements them seamlessly. He never submits work without proper testing. The go-to guy if you want things done quickly and properly. Highly recommended. Great sense of humour and fun to work with.",
                ],
            },
            {
                name: 'Benjamin Gakami',
                title: 'CTO at Sales Zote',
                date: 'September 29, 2025',
                relationship: 'Benjamin managed Emmanuel directly',
                quote: [
                    'I had the pleasure of working with Emmanuel, and he is an exceptional developer and UI/UX designer. His attention to detail is unmatched, consistently delivering clean code and pixel-perfect designs that elevate the entire product.',
                    'He combines strong technical skills with creative problem-solving, and his collaborative attitude makes him a valuable addition to any team.',
                    'I highly recommend him to any organization looking for top talent.',
                ],
            },
            {
                name: 'Brian Ireri',
                title: 'Co-Founder & Software Engineer at CodeBreeze Ltd',
                date: 'September 27, 2025',
                relationship: 'Brian worked with Emmanuel on the same team',
                quote: [
                    'I had the privilege of working with Emmanuel, and I can attest to his outstanding expertise as a UI/UX designer with solid web development skills in Vue.js and Laravel. He consistently demonstrates professionalism, excellent communication, and reliability in meeting deadlines.',
                    'Emmanuel excels at understanding requirements and transforming them into well-thought-out, user-friendly solutions. His design skills are truly exceptional, and any team would be fortunate to have him as a contributor.',
                ],
            },
            {
                name: 'Eva Mwangi',
                title: 'Software Engineer at Trippz',
                date: 'December 2, 2025',
                relationship: 'Eva worked with Emmanuel on the same team',
                quote: [
                    'During our time working side-by-side on the front-end team, Emmanuel consistently demonstrated a deep technical understanding of modern web standards, component-based architecture, and best practices in Vue.js/Laravel technologies.',
                    'I have been fortunate to witness the exceptional learning ability while he trained on becoming a designer. I personally can attest to the quality of his work, where he leverages his engineering background to ensure his designs are not only visually excellent but also highly efficient and feasible to implement.',
                ],
            },
        ] satisfies Testimonial[],
    },

    contact: {
        heading: 'Get in touch',
        /** Each entry starts a new line. */
        text: [
            'Got a problem worth solving, an idea worth building, or just want to talk shop?',
            'My inbox is open.',
        ],
        cta: letsTalk,
    },

    socials: [
        {
            id: 'github',
            label: 'GitHub',
            href: 'https://github.com/ekaranjaa',
            icon: markRaw(GithubIcon),
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            href: 'https://linkedin.com/in/ekaranjaa',
            icon: markRaw(LinkedinIcon),
        },
        {
            id: 'instagram',
            label: 'Instagram',
            href: 'https://instagram.com/designs_by_karanja',
            icon: markRaw(InstagramIcon),
        },
    ] satisfies Social[],
}
