module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './tests/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        pink: 'var(--color-pink)',
        raspberry: 'var(--color-raspberry)',
        rule: 'var(--color-rule)',
        control: 'var(--color-control-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        gutter: 'var(--gutter)',
        section: 'var(--section-padding)',
        content: 'var(--content-max)',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
      borderRadius: {
        control: 'var(--radius-control)',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['Georgia', 'serif'],
      },
      fontSize: {
        home: 'var(--text-home-name)',
        page: 'var(--text-page-title)',
        section: 'var(--text-section-title)',
        card: 'var(--text-card-title)',
        intro: 'var(--text-intro)',
        body: 'var(--text-body)',
        caption: 'var(--text-caption)',
        eyebrow: 'var(--text-eyebrow)',
        tagline: 'var(--text-tagline)',
      },
      minHeight: {
        control: 'var(--control-min-height)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        standard: 'var(--motion-standard)',
        page: 'var(--motion-page)',
      },
      transitionTimingFunction: {
        editorial: 'var(--motion-ease)',
      },
      screens: {
        medium: '48rem',
        wide: '64rem',
      },
      gridTemplateColumns: {
        compact: 'repeat(4, minmax(0, 1fr))',
        medium: 'repeat(6, minmax(0, 1fr))',
        wide: 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        grid: 'var(--grid-gap)',
      },
      outlineWidth: {
        3: '3px',
      },
      outlineOffset: {
        2: '2px',
      },
      borderWidth: {
        control: 'var(--border-control)',
      },
    },
  },
  plugins: [],
}
