<script setup lang="ts">
    import { onMounted, onUnmounted } from 'vue'
    import gsap from 'gsap'
    import Button from '@/components/Button.vue'
    import Tag from '@/components/Tag.vue'
    import CursorIcon from '@/icons/CursorIcon.vue'
    import { portfolio } from '@/data/portfolio.ts'
    import type { HeroTag } from '@/data/portfolio.ts'

    const { hero, socials } = portfolio

    /**
     * Where each tag sits on the photo and how its cursor points at it, in hero.tags order.
     * Offsets come from the design; the desktop overhangs stay within the container padding.
     * Each tag floats out of step with the others (float), drifts toward the mouse by its own
     * distance in px at the section's edges (depth), and springs back over its own time in
     * seconds (duration), so the three read as layered objects with different weights.
     */
    const TAG_PLACEMENTS = [
        {
            tag: '-right-2.5 top-4 xl:right-5 xl:top-5',
            cursor: '-left-7 top-9',
            pointer: '-scale-y-100 rotate-36',
            float: '',
            depth: 20,
            duration: 1.5,
        },
        {
            tag: '-left-5 top-3/5 xl:-left-29 xl:top-9/16',
            cursor: '-right-7 -top-8',
            pointer: '-scale-y-100 -rotate-144',
            float: '[animation-delay:-1.4s]',
            depth: 28,
            duration: 1.8,
        },
        {
            tag: '-right-4.5 top-8/9 xl:top-7/8',
            cursor: '-left-6 -top-7.5',
            pointer: '-rotate-36',
            float: '[animation-delay:-2.7s]',
            depth: 12,
            duration: 1.2,
        },
    ]

    /** px of throw per px/ms of cursor speed, so fast flicks fling the tags further. */
    const THROW = 25
    const MAX_THROW = 60
    /** ms the cursor must rest before the throw falls away and the tags settle. */
    const SETTLE_DELAY = 150

    const tagElements: HTMLElement[] = []
    let context: gsap.Context | undefined
    let movers: { x: gsap.QuickToFunc; y: gsap.QuickToFunc }[] = []
    let lastMove: { x: number; y: number; time: number } | undefined
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    onMounted(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        context = gsap.context(() => {
            movers = tagElements.map((element, index) => {
                const vars = {
                    duration: TAG_PLACEMENTS[index].duration,
                    ease: 'elastic.out(1, 0.35)',
                }
                return { x: gsap.quickTo(element, 'x', vars), y: gsap.quickTo(element, 'y', vars) }
            })
        })
    })

    onUnmounted(() => {
        clearTimeout(settleTimer)
        context?.revert()
    })

    /** Sends each tag toward its drift for the pointer's position plus a throw from its speed. */
    function drift(offsetX: number, offsetY: number, speedX = 0, speedY = 0) {
        const clampThrow = gsap.utils.clamp(-MAX_THROW, MAX_THROW)
        movers.forEach((mover, index) => {
            const { depth } = TAG_PLACEMENTS[index]
            mover.x(offsetX * depth + clampThrow(speedX * THROW))
            mover.y(offsetY * depth + clampThrow(speedY * THROW))
        })
    }

    function onPointerMove(event: PointerEvent) {
        // Touch has no hover cursor to follow, so tags only float there.
        if (!movers.length || event.pointerType !== 'mouse') return
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
        // The pointer's offset from the section's centre, -1 to 1 on each axis.
        const offsetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const offsetY = ((event.clientY - rect.top) / rect.height) * 2 - 1
        const elapsed = lastMove ? Math.max(event.timeStamp - lastMove.time, 1) : 1
        const speedX = lastMove ? (event.clientX - lastMove.x) / elapsed : 0
        const speedY = lastMove ? (event.clientY - lastMove.y) / elapsed : 0
        lastMove = { x: event.clientX, y: event.clientY, time: event.timeStamp }

        drift(offsetX, offsetY, speedX, speedY)
        clearTimeout(settleTimer)
        settleTimer = setTimeout(() => drift(offsetX, offsetY), SETTLE_DELAY)
    }

    function onPointerLeave() {
        clearTimeout(settleTimer)
        lastMove = undefined
        drift(0, 0)
    }

    const CURSOR_COLORS: Record<HeroTag['color'], string> = {
        'pink-accent': 'text-pink-accent',
        'blue-accent': 'text-blue-accent',
        'green-accent': 'text-green-accent',
    }
</script>

<template>
    <section
        class="container mx-auto flex flex-col-reverse gap-6 px-6 py-10 xl:flex-row xl:items-center xl:justify-between xl:pb-20"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
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

            <!-- GSAP moves the outer element and the float runs on the inner one, so the two
                 never compete for the same transform. -->
            <div
                v-for="(tag, index) in hero.tags"
                :key="tag.label"
                :ref="(element) => (tagElements[index] = element as HTMLElement)"
                class="absolute"
                :class="TAG_PLACEMENTS[index].tag"
            >
                <div
                    class="relative animate-float motion-reduce:animate-none"
                    :class="TAG_PLACEMENTS[index].float"
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
        </div>
    </section>
</template>
