<script setup lang="ts">
    import Button from '@/components/Button.vue'
    import Card from '@/components/Card.vue'
    import ArrowOutwardIcon from '@/icons/ArrowOutwardIcon.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { heading, cta, comingSoon, items } = portfolio.projects

    // The first project gets the wide feature card; the rest share the grid below it.
    const [featured, ...others] = items
</script>

<template>
    <section id="work" class="container mx-auto flex flex-col gap-6 px-6 py-10 lg:gap-10 lg:py-20">
        <h2 class="text-center font-display text-8xl uppercase">{{ heading }}</h2>

        <Card
            class="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:gap-10 lg:p-10"
            :class="featured.dark ? 'text-white' : 'text-black'"
            :style="{ backgroundColor: featured.color }"
        >
            <img
                :src="featured.image.src"
                :alt="featured.image.alt"
                class="mx-auto w-full max-w-145 lg:w-145 lg:shrink-0"
            />
            <div class="flex flex-1 flex-col gap-6">
                <h3 class="font-display text-7xl uppercase">{{ featured.name }}</h3>
                <p class="text-2xl">{{ featured.description }}</p>
                <Button
                    v-if="featured.href"
                    :href="featured.href"
                    color="white"
                    size="md"
                    target="_blank"
                    rel="noopener"
                    class="w-full lg:w-auto lg:min-w-50 lg:self-start"
                >
                    {{ cta }}
                    <template #trailing><ArrowOutwardIcon /></template>
                </Button>
            </div>
        </Card>

        <div class="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <Card
                v-for="project in others"
                :key="project.name"
                class="flex flex-col gap-6 p-6"
                :class="project.dark ? 'text-white' : 'text-black'"
                :style="{ backgroundColor: project.color }"
            >
                <!-- The export is 516px wide at 1x: the rotated phones overhang their 480px frame. -->
                <img
                    :src="project.image.src"
                    :alt="project.image.alt"
                    loading="lazy"
                    class="mx-auto w-full max-w-129"
                />
                <h3 class="font-display text-7xl uppercase">{{ project.name }}</h3>
                <!-- flex-1 pushes the buttons in a row of cards to the same baseline. -->
                <p class="flex-1 text-2xl">{{ project.description }}</p>
                <Button
                    v-if="project.href"
                    :href="project.href"
                    color="white"
                    size="md"
                    target="_blank"
                    rel="noopener"
                    class="w-full lg:w-auto lg:min-w-50 lg:self-start"
                >
                    {{ cta }}
                    <template #trailing><ArrowOutwardIcon /></template>
                </Button>
                <p v-else class="text-center font-display text-3xl uppercase lg:text-left">
                    {{ comingSoon }}
                </p>
            </Card>
        </div>
    </section>
</template>
