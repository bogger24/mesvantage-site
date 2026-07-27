/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2D52',
          dark: '#091e38',
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
        ink: '#1A1A2E',
      },
      fontFamily: {
        // 'Inter Variable' is the family name @fontsource-variable/inter registers.
        // Asking for 'Inter' silently matched nothing and fell back to system-ui.
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
