/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: 'rgb(var(--color-text) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        tint: 'rgb(var(--color-tint) / <alpha-value>)',
        icon: 'rgb(var(--color-icon) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        tabIconDefault: 'rgb(var(--color-tab-icon-default) / <alpha-value>)',
        tabIconSelected: 'rgb(var(--color-tab-icon-selected) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['ui-serif', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
