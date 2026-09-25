<script setup lang="ts">
    type Color = 'pink-accent' | 'blue-accent' | 'green-accent'

    const props = defineProps<{
        color: Color
    }>()

    const COLOR_CLASSES: Record<Color, string> = {
        'pink-accent': 'bg-pink-accent',
        'blue-accent': 'bg-blue-accent',
        'green-accent': 'bg-green-accent',
    }
</script>

<template>
    <span
        class="inline-flex items-center rounded-lg border-2 border-black px-3 py-2 text-base leading-tight font-bold whitespace-nowrap text-white shadow-xs"
        :class="COLOR_CLASSES[props.color]"
    >
        <slot />
    </span>
</template>
