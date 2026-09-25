<script setup lang="ts">
    import { computed } from 'vue'

    type Color = 'primary' | 'white' | 'blue-accent' | 'github' | 'linkedin' | 'instagram'

    const props = withDefaults(
        defineProps<{
            color?: Color
            size?: 'md' | 'lg'
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

    // Icons inside the button are sized here so call sites never repeat it.
    const SIZE_CLASSES = {
        md: 'text-3xl [&_svg]:size-8',
        lg: 'text-4xl [&_svg]:size-10',
    } as const

    const colorClasses = computed(() => COLOR_CLASSES[props.color])
    const sizeClasses = computed(() => SIZE_CLASSES[props.size])
    const paddingClasses = computed(() => (props.iconOnly ? 'p-3.5 lg:p-5' : 'px-6 py-3'))
</script>

<template>
    <component
        :is="href ? 'a' : 'button'"
        :href="href"
        :type="href ? undefined : type"
        class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-4 border-black font-display uppercase shadow-md outline-hidden transition hover:bg-blue-accent hover:shadow-sm focus-visible:bg-blue-accent focus-visible:shadow-sm"
        :class="[colorClasses, sizeClasses, paddingClasses]"
    >
        <slot />
        <slot name="trailing" />
    </component>
</template>
