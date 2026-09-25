<script setup lang="ts">
    type Color = 'white' | 'primary'

    const props = withDefaults(
        defineProps<{
            color?: Color
        }>(),
        {
            color: 'white',
        },
    )

    // Project cards pass their brand colour from data as an inline style, which overrides this.
    const COLOR_CLASSES: Record<Color, string> = {
        white: 'bg-white',
        primary: 'bg-primary',
    }
</script>

<template>
    <div class="rounded-3xl border-8 border-black shadow-xl" :class="COLOR_CLASSES[props.color]">
        <slot />
    </div>
</template>
