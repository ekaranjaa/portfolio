<script setup lang="ts">
    import Button from '@/components/Button.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { site, contact, socials } = portfolio
</script>

<template>
    <footer
        id="contact"
        class="container mx-auto flex flex-col items-center gap-10 px-6 py-10 text-center lg:py-20"
    >
        <div>
            <h2 class="font-display text-8xl uppercase">{{ contact.heading }}</h2>
            <p class="text-2xl opacity-50">
                <template v-for="(line, index) in contact.text" :key="line">
                    <br v-if="index" />
                    {{ line }}
                </template>
            </p>
        </div>

        <div class="flex w-full flex-col gap-6 lg:w-auto">
            <Button :href="contact.cta.href" class="w-full lg:w-78">
                {{ contact.cta.label }}
            </Button>
            <div class="flex gap-6">
                <Button
                    v-for="social in socials"
                    :key="social.id"
                    :href="social.href"
                    :color="social.id"
                    icon-only
                    target="_blank"
                    rel="noopener"
                    :aria-label="social.label"
                    class="flex-1 lg:flex-none"
                >
                    <component :is="social.icon" />
                </Button>
            </div>
        </div>

        <p class="text-base opacity-50">{{ site.credit }}</p>
    </footer>
</template>
