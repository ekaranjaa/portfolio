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

export const portfolio = {
    site: {
        name: 'Emmanuel Karanja',
        title: 'Emmanuel Karanja — Product Developer',
        description:
            'I design and build digital products; bringing together product thinking, user experience, and engineering to turn ideas into useful, well-crafted software.',
        credit: 'Designed & built by Emmanuel Karanja.',
    },

    navigation: {
        links: [
            { label: 'About', href: '#about' },
            { label: 'Experience', href: '#experience' },
            { label: 'Work', href: '#work' },
            { label: 'Testimonials', href: '#testimonials' },
        ] satisfies Link[],
        cta: { label: 'Let’s talk', href: '#contact' } satisfies Link,
    },

    contact: {
        heading: 'Get in touch',
        /** Each entry starts a new line. */
        text: [
            'Got a problem worth solving, an idea worth building, or just want to talk shop?',
            'My inbox is open.',
        ],
        // TODO: add the email address after mailto:
        cta: { label: 'Let’s talk', href: 'mailto:' } satisfies Link,
    },

    socials: [
        // TODO: replace each '#' with the profile URL.
        { id: 'github', label: 'GitHub', href: '#', icon: markRaw(GithubIcon) },
        { id: 'linkedin', label: 'LinkedIn', href: '#', icon: markRaw(LinkedinIcon) },
        { id: 'instagram', label: 'Instagram', href: '#', icon: markRaw(InstagramIcon) },
    ] satisfies Social[],
}
