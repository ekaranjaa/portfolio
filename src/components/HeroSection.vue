<script setup lang="ts">
    import Button from '@/components/Button.vue'
    import Tag from '@/components/Tag.vue'
    import CursorIcon from '@/icons/CursorIcon.vue'
    import { portfolio } from '@/data/portfolio.ts'
    import type { HeroTag } from '@/data/portfolio.ts'

    const { hero, socials } = portfolio

    /**
     * Where each tag sits on the photo and how its cursor points at it, in hero.tags order.
     * Offsets come from the design; the desktop overhangs stay within the container padding.
     */
    const TAG_PLACEMENTS = [
        {
            tag: '-right-2.5 top-4 xl:right-5 xl:top-5',
            cursor: '-left-7 top-9',
            pointer: '-scale-y-100 rotate-36',
        },
        {
            tag: '-left-5 top-3/5 xl:-left-29 xl:top-9/16',
            cursor: '-right-7 -top-8',
            pointer: '-scale-y-100 -rotate-144',
        },
        {
            tag: '-right-4.5 top-8/9 xl:top-7/8',
            cursor: '-left-6 -top-7.5',
            pointer: '-rotate-36',
        },
    ]

    const CURSOR_COLORS: Record<HeroTag['color'], string> = {
        'pink-accent': 'text-pink-accent',
        'blue-accent': 'text-blue-accent',
        'green-accent': 'text-green-accent',
    }
</script>

<template>
    <section
        class="container mx-auto flex flex-col-reverse gap-6 px-6 py-10 xl:flex-row xl:items-center xl:justify-between xl:pb-20"
    >
        <div class="flex flex-col gap-6 xl:max-w-152 xl:gap-10">
            <div class="flex flex-col gap-2 xl:gap-3">
                <h1 class="flex flex-col gap-2 xl:gap-3">
                    <span class="text-2xl">{{ hero.greeting }}</span>
                    <span class="font-display text-8xl uppercase">{{ hero.title }}</span>
                </h1>
                <p class="text-2xl">{{ hero.description }}</p>
            </div>

            <div class="flex flex-col gap-6 md:flex-row">
                <Button :href="hero.cta.href" class="md:flex-1">{{ hero.cta.label }}</Button>
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
                        class="flex-1 md:flex-none"
                    >
                        <component :is="social.icon" />
                    </Button>
                </div>
            </div>
        </div>

        <div class="relative mx-auto w-full max-w-117 xl:mx-0">
            <div
                class="absolute inset-x-0 bottom-0 aspect-469/500 rounded-t-full border-8 border-black bg-pink-accent shadow-lg"
            />
            <!-- The design crops and zooms the photo slightly within its frame. -->
            <div class="relative aspect-469/633 overflow-hidden">
                <img
                    :src="hero.image.src"
                    :alt="hero.image.alt"
                    fetchpriority="high"
                    class="absolute top-[-2.21%] left-0 h-[105.32%] w-[106.61%] max-w-none"
                />
            </div>

            <div
                v-for="(tag, index) in hero.tags"
                :key="tag.label"
                class="absolute"
                :class="TAG_PLACEMENTS[index].tag"
            >
                <Tag :color="tag.color">{{ tag.label }}</Tag>
                <div
                    class="absolute flex size-9 items-center justify-center"
                    :class="[TAG_PLACEMENTS[index].cursor, CURSOR_COLORS[tag.color]]"
                >
                    <CursorIcon class="w-6" :class="TAG_PLACEMENTS[index].pointer" />
                </div>
            </div>
        </div>
    </section>
</template>
