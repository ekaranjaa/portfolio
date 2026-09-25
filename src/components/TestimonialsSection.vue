<script setup lang="ts">
    import { computed, ref } from 'vue'
    import ArrowBackIcon from '@/icons/ArrowBackIcon.vue'
    import ArrowForwardIcon from '@/icons/ArrowForwardIcon.vue'
    import RemoveIcon from '@/icons/RemoveIcon.vue'
    import TestimonialsBadge from '@/icons/TestimonialsBadge.vue'
    import { portfolio } from '@/data/portfolio.ts'

    const { heading, label, items } = portfolio.testimonials

    const current = ref(0)
    const atStart = computed(() => current.value === 0)
    const atEnd = computed(() => current.value === items.length - 1)

    // The arrows use aria-disabled rather than disabled so they keep keyboard focus at either end.
    function previous() {
        if (!atStart.value) current.value--
    }

    function next() {
        if (!atEnd.value) current.value++
    }

    const ARROW_CLASSES =
        'flex cursor-pointer items-center justify-center rounded-full border-3 border-white p-4 transition hover:bg-white hover:text-black aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:hover:bg-transparent aria-disabled:hover:text-white lg:p-5.25'
</script>

<template>
    <section
        id="testimonials"
        aria-roledescription="carousel"
        aria-labelledby="testimonials-heading"
        class="bg-black text-white"
    >
        <div class="container mx-auto flex flex-col gap-6 px-6 py-10 lg:gap-0 lg:py-20">
            <!-- The badge carries the visible heading, so this one is for screen readers. -->
            <h2 id="testimonials-heading" class="sr-only">{{ heading }} — {{ label }}</h2>

            <div class="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
                <div class="flex shrink-0 items-center justify-center py-5 lg:size-121.5 lg:py-0">
                    <TestimonialsBadge
                        class="size-74 animate-spin-slow motion-reduce:animate-none lg:size-105"
                    />
                </div>

                <!-- On mobile only the current testimonial takes space, so the block hugs it.
                     From lg they share one grid cell, keeping the arrows still while switching. -->
                <div class="grid flex-1" aria-live="polite">
                    <figure
                        v-for="(testimonial, index) in items"
                        :key="testimonial.name"
                        role="group"
                        aria-roledescription="slide"
                        :aria-label="`${index + 1} of ${items.length}`"
                        class="col-start-1 row-start-1 flex-col justify-center gap-4 text-center lg:text-left"
                        :class="index === current ? 'flex' : 'hidden lg:invisible lg:flex'"
                    >
                        <blockquote class="flex flex-col gap-4 text-2xl">
                            <p v-for="paragraph in testimonial.quote" :key="paragraph">
                                {{ paragraph }}
                            </p>
                        </blockquote>
                        <figcaption class="flex justify-center gap-2 text-2xl lg:justify-start">
                            <RemoveIcon class="hidden size-8.5 shrink-0 lg:block" />
                            <span class="flex flex-col gap-1 lg:gap-0">
                                <span class="font-bold">{{ testimonial.name }}</span>
                                <span class="opacity-70">{{ testimonial.title }}</span>
                            </span>
                        </figcaption>
                    </figure>
                </div>
            </div>

            <div class="flex justify-center gap-6 lg:justify-end lg:gap-10">
                <button
                    type="button"
                    aria-label="Previous testimonial"
                    :aria-disabled="atStart"
                    :class="ARROW_CLASSES"
                    @click="previous"
                >
                    <ArrowBackIcon class="size-10" />
                </button>
                <button
                    type="button"
                    aria-label="Next testimonial"
                    :aria-disabled="atEnd"
                    :class="ARROW_CLASSES"
                    @click="next"
                >
                    <ArrowForwardIcon class="size-10" />
                </button>
            </div>
        </div>
    </section>
</template>
