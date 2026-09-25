<script setup lang="ts">
    import Card from '@/components/Card.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { about, stack } = portfolio
</script>

<template>
    <section id="about" class="container mx-auto flex flex-col gap-10 px-6 py-10 lg:pb-20">
        <h2 class="font-display text-8xl uppercase">{{ about.heading }}</h2>

        <div class="flex items-start">
            <!-- Paragraphs are trusted HTML from portfolio.ts, so they can carry emphasis and links. -->
            <div
                class="flex flex-1 flex-col gap-7 text-2xl lg:gap-8 [&_a]:font-bold [&_a]:text-blue-accent [&_a]:underline [&_strong]:font-bold"
            >
                <p v-for="paragraph in about.paragraphs" :key="paragraph" v-html="paragraph" />
            </div>
            <div class="hidden flex-1 lg:block">
                <img src="/images/about-illustration.webp" alt="" class="w-full" />
            </div>
        </div>

        <Card color="primary" class="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:p-10">
            <div class="flex shrink-0 flex-col gap-6 lg:w-75">
                <h3 class="font-display text-8xl uppercase">{{ stack.heading }}</h3>
                <p class="text-xl">{{ stack.description }}</p>
            </div>
            <div class="grid gap-6 lg:grid-cols-2">
                <div v-for="item in stack.items" :key="item.name" class="flex flex-col gap-2">
                    <h4 class="text-3xl font-bold">{{ item.name }}</h4>
                    <p class="text-xl">{{ item.description }}</p>
                </div>
            </div>
        </Card>
    </section>
</template>
