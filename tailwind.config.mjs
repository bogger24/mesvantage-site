/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2D52',
          dark: '#091e38',
          // Near-black navy for "product" surfaces. The mid-navy above reads as a brand
          // colour; this reads as an instrument. Dark sections are the product, light
          // sections are the argument.
          deep: '#061426',
          // A slightly lifted surface for panels and alternating sections on the continuous
          // dark canvas. Depth on this site comes from surface shifts and hairlines, never
          // from a jump to white.
          lift: '#0A1B30',
        },
        // Context-bound accent. The previous single value (#1A7FBF) failed WCAG AA against
        // every background it was used on: 4.35:1 with white on the primary CTA, 3.18:1 as
        // text on navy. There is no one blue that passes on both a light and a dark surface,
        // so there are two.
        accent: {
          DEFAULT: '#156C9E',   // 5.72:1 with white · 5.43:1 on surface — light surfaces only
          dark: '#11557C',      // hover
          onDark: '#4DA3FB',    // 5.24:1 on navy — dark surfaces only
        },
        // Solid muted text. Opacity-derived greys (text-ink/40, text-white/40 …) were used
        // ~74 times and every level below 70% failed AA.
        muted: {
          DEFAULT: '#52596B',   // 6.64:1 on surface
          soft: '#5C6478',      // 5.62:1 on surface
          onDark: '#B6C2D4',    // 7.68:1 on navy
        },
        surface: '#F8F9FB',
        border: '#E2E8F0',
        // Hairlines. The structural device on this site is a 1px rule, not a card border with
        // a shadow, so the rule colour is a token rather than an opacity guess at each site.
        rule: {
          DEFAULT: '#DFE4EC',
          strong: '#C3CBD8',
          onDark: '#1E3A5F',
          onDeep: '#14304F',
        },
        ink: '#1A1A2E',
      },
      fontFamily: {
        // 'Inter Variable' is the family name @fontsource-variable/inter registers.
        // Asking for 'Inter' silently matched nothing and fell back to system-ui.
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        // Every evidence-bearing number, identifier, timestamp and build hash is set in this.
        // It is the site's signature typographic device: numbers here are records, not
        // adjectives, and they should not look like the headline they sit under.
        mono: ['JetBrains Mono Variable', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Display sizes carry negative tracking and a tight paired line-height. Most of what
        // makes type feel considered rather than default is in these two numbers.
        'display-hero': [
          'clamp(2.75rem, 6.5vw, 5.5rem)',
          { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '800' },
        ],
        'display-xl': ['4.25rem', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-lg': ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-sm': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Mono figure sizes, for the facts band and any tabular readout.
        'figure-lg': ['2.125rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
        'figure-md': ['1.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '600' }],
      },
      borderRadius: {
        // Industrial radii. The stock scale tops out at 1.5rem and `rounded-2xl` was used
        // throughout, which reads as consumer SaaS. Nothing on an instrument is that round.
        none: '0',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '10px',
        '3xl': '12px',
        full: '9999px',
      },
      letterSpacing: {
        eyebrow: '0.16em',
      },
    },
  },
  plugins: [],
};
