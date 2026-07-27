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
        accent: {
          DEFAULT: '#1A7FBF',
          dark: '#1468a0',
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
