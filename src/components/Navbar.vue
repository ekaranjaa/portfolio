<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue'
    import Button from '@/components/Button.vue'
    import Logo from '@/icons/Logo.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { links, cta } = portfolio.navigation

    /** The first link stays highlighted until another section scrolls into view, as in the design. */
    const activeHref = ref(links[0].href)

    let observer: IntersectionObserver | undefined

    onMounted(() => {
        // A section becomes current once it crosses the middle of the viewport.
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) activeHref.value = `#${entry.target.id}`
                }
            },
            { rootMargin: '-50% 0px -50% 0px' },
        )

        for (const link of links) {
            const section = document.querySelector(link.href)
            if (section) observer.observe(section)
        }
    })

    onUnmounted(() => observer?.disconnect())
</script>

<template>
    <header class="sticky top-0 z-40 border-b-8 border-black bg-white">
        <div class="container mx-auto flex items-center justify-between px-6 py-6 lg:py-5">
            <a href="/" :aria-label="portfolio.site.name">
                <Logo class="h-8 w-auto lg:h-13" />
            </a>

            <nav class="hidden items-center gap-6 lg:flex">
                <a
                    v-for="link in links"
                    :key="link.href"
                    :href="link.href"
                    class="border-b-4 text-2xl font-medium"
                    :class="
                        activeHref === link.href
                            ? 'border-blue-accent text-blue-accent'
                            : 'border-transparent'
                    "
                    :aria-current="activeHref === link.href ? 'location' : undefined"
                >
                    {{ link.label }}
                </a>
            </nav>

            <!-- The CTA changes size at the breakpoint, so each size gets its own instance. -->
            <div class="hidden lg:block">
                <Button :href="cta.href" color="white" size="md" class="w-50">
                    {{ cta.label }}
                </Button>
            </div>
            <div class="lg:hidden">
                <Button :href="cta.href" color="white" size="sm">{{ cta.label }}</Button>
            </div>
        </div>
    </header>
</template>
