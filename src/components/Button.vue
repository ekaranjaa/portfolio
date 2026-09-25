<script setup lang="ts">
    import { computed } from 'vue'

    type Color = 'primary' | 'white' | 'blue-accent' | 'github' | 'linkedin' | 'instagram'

    const props = withDefaults(
        defineProps<{
            color?: Color
            size?: 'sm' | 'md' | 'lg'
            iconOnly?: boolean
            type?: 'button' | 'submit' | 'reset'
            href?: string
        }>(),
        {
            color: 'primary',
            size: 'lg',
            iconOnly: false,
            type: 'button',
            href: undefined,
        },
    )

    const COLOR_CLASSES: Record<Color, string> = {
        primary: 'bg-primary text-black',
        white: 'bg-white text-black',
        'blue-accent': 'bg-blue-accent text-white',
        github: 'bg-github text-white',
        linkedin: 'bg-linkedin text-white',
        instagram: 'bg-instagram text-white',
    }

    const SIZE_CLASSES = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
    } as const

    const PADDING_CLASSES = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-6 py-3',
    } as const

    const colorClasses = computed(() => COLOR_CLASSES[props.color])
    const sizeClasses = computed(() => SIZE_CLASSES[props.size])
    const paddingClasses = computed(() =>
        props.iconOnly ? 'p-3.5 lg:p-5' : PADDING_CLASSES[props.size],
    )
    // Icons are sized here so call sites never repeat it: beside a label they match its font
    // size, as in the design; on their own they stay at the design's 40px.
    const iconClasses = computed(() => (props.iconOnly ? '[&_svg]:size-10' : '[&_svg]:size-[1em]'))
</script>

<template>
    <component
        :is="href ? 'a' : 'button'"
        :href="href"
        :type="href ? undefined : type"
        class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-4 border-black font-display uppercase shadow-md outline-hidden transition hover:bg-blue-accent hover:shadow-sm focus-visible:bg-blue-accent focus-visible:shadow-sm"
        :class="[colorClasses, sizeClasses, paddingClasses, iconClasses]"
    >
        <slot />
        <slot name="trailing" />
    </component>
</template>
