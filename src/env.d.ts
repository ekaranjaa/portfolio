interface Window {
    /** Set by src/components/posthog.astro, and only on the live site. */
    posthog?: import('posthog-js').PostHog
}
