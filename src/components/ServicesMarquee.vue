<script setup lang="ts">
    import { portfolio } from '@/data/portfolio.ts'

    const { services } = portfolio
</script>

<template>
    <!-- The padding matches how far the tilted band rises and drops at the current width. -->
    <section class="overflow-hidden py-[calc(50vw*sin(3deg))]" aria-label="Services">
        <div class="-mx-4 -rotate-3 bg-black py-6">
            <div class="flex w-max animate-marquee motion-reduce:animate-none">
                <ul
                    v-for="copy in 2"
                    :key="copy"
                    class="flex items-center gap-4 pr-4 text-2xl text-white uppercase lg:gap-10 lg:pr-10 lg:text-4xl"
                    :aria-hidden="copy === 2 ? 'true' : undefined"
                >
                    <template v-for="service in services" :key="service">
                        <li class="whitespace-nowrap">{{ service }}</li>
                        <li class="size-2 shrink-0 bg-primary lg:size-4" aria-hidden="true" />
                    </template>
                </ul>
            </div>
        </div>
    </section>
</template>
