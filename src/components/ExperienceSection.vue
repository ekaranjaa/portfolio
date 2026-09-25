<script setup lang="ts">
    import { ref } from 'vue'
    import Badge from '@/components/Badge.vue'
    import Button from '@/components/Button.vue'
    import Card from '@/components/Card.vue'
    import ArrowOutwardIcon from '@/icons/ArrowOutwardIcon.vue'
    import ChevronRightIcon from '@/icons/ChevronRightIcon.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { heading, resume, jobs } = portfolio.experience

    const selected = ref(0)
    const tabs: HTMLButtonElement[] = []

    const STEPS: Record<string, number> = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1,
    }

    /** Arrow keys wrap around the companies and Home/End jump to either end (WAI-ARIA tabs). */
    function onKeydown(event: KeyboardEvent) {
        let next: number
        if (event.key in STEPS)
            next = (selected.value + STEPS[event.key] + jobs.length) % jobs.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = jobs.length - 1
        else return

        event.preventDefault()
        selected.value = next
        tabs[next]?.focus()
    }
</script>

<template>
    <section id="experience" class="container mx-auto flex flex-col gap-6 px-6 py-10 lg:gap-10">
        <h2 class="font-display text-8xl uppercase">{{ heading }}</h2>

        <div class="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <Card class="p-6 lg:w-105 lg:shrink-0 lg:p-10">
                <div
                    role="tablist"
                    aria-label="Companies"
                    aria-orientation="vertical"
                    class="flex flex-col gap-8"
                    @keydown="onKeydown"
                >
                    <button
                        v-for="(job, index) in jobs"
                        :id="`experience-tab-${index}`"
                        :key="job.company"
                        :ref="(el) => (tabs[index] = el as HTMLButtonElement)"
                        type="button"
                        role="tab"
                        :aria-selected="index === selected"
                        :aria-controls="`experience-panel-${index}`"
                        :tabindex="index === selected ? 0 : -1"
                        class="flex cursor-pointer items-center text-left text-2xl leading-relaxed"
                        :class="
                            index === selected
                                ? 'font-bold text-blue-accent'
                                : 'opacity-60 hover:opacity-100'
                        "
                        @click="selected = index"
                    >
                        <span class="flex-1">{{ job.company }}</span>
                        <ChevronRightIcon v-if="index === selected" class="size-10 shrink-0" />
                    </button>
                </div>
            </Card>

            <!-- Every job renders in the same grid cell, so the card keeps the height of the
                 longest one and nothing below it moves when switching companies. -->
            <Card class="grid flex-1 p-6 lg:p-10">
                <div
                    v-for="(job, index) in jobs"
                    :id="`experience-panel-${index}`"
                    :key="job.company"
                    role="tabpanel"
                    :aria-labelledby="`experience-tab-${index}`"
                    tabindex="0"
                    class="col-start-1 row-start-1 flex flex-col justify-center gap-3 lg:gap-4"
                    :class="{ invisible: index !== selected }"
                >
                    <h3 class="text-2xl font-bold lg:text-3xl">{{ job.role }}</h3>
                    <p class="text-xl leading-relaxed font-medium opacity-70">{{ job.period }}</p>
                    <p class="text-base leading-relaxed opacity-60 lg:text-2xl">
                        {{ job.description }}
                    </p>
                    <ul class="flex flex-wrap gap-3 lg:gap-4">
                        <li v-for="technology in job.technologies" :key="technology">
                            <Badge>{{ technology }}</Badge>
                        </li>
                    </ul>
                </div>
            </Card>
        </div>

        <Button
            :href="resume.href"
            color="blue-accent"
            target="_blank"
            rel="noopener"
            class="w-full"
        >
            {{ resume.label }}
            <template #trailing><ArrowOutwardIcon /></template>
        </Button>
    </section>
</template>
