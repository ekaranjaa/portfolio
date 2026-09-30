// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import vue from '@astrojs/vue'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
    site: 'https://ekaranja.me',

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [vue(), sitemap()],

    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: 'Space Grotesk',
            cssVariable: '--font-space-grotesk',
            weights: [400, 500, 700],
            styles: ['normal'],
        },
        {
            provider: fontProviders.local(),
            name: 'Lova Bold',
            cssVariable: '--font-lova',
            options: {
                variants: [
                    { src: ['./src/assets/fonts/LovaBold.woff2'], weight: 400, style: 'normal' },
                ],
            },
        },
    ],
})
