/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Official RAAHI Brand Tokens */
        brand: {
          emerald: '#0B9B6E',
          'deep-emerald': '#07543F',
          navy: '#152238',
          'off-white': '#F8F7F3',
          white: '#FFFFFF',
          mint: '#E8F7F1',
          accent: '#F4A340',
        },
        /* New STHANIQ design tokens */
        st: {
          primary: '#0B9B6E',
          'primary-dark': '#07543F',
          'primary-soft': '#E8F7F1',
          accent: '#F4A340',
          'accent-dark': '#D45D0E',
          'accent-soft': '#FEF0E6',
          amber: '#F4A340',
          bg: '#F8F7F3',
          canvas: '#FFFFFF',
          surface: '#FAFCFB',
          muted: '#F1F5F3',
          text: '#152238',
          'text-2': '#4A5C6E',
          'text-muted': '#8A9BAD',
          border: '#E0E8E4',
          outer: '#07543F',
        },
        /* Legacy aliases */
        raahi: {
          orange: '#F4A340',
          amber: '#F4A340',
          deep: '#07543F',
          green: '#0B9B6E',
          'green-dark': '#07543F',
          bg: '#F8F7F3',
          surface: '#FFFFFF',
          text: '#152238',
          muted: '#8A9BAD',
          border: '#E0E8E4',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'DM Sans', 'sans-serif'],
        body: ['DM Sans', 'Inter', 'sans-serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(21, 34, 56, 0.06)',
        'sm': '0 4px 12px rgba(21, 34, 56, 0.06)',
        'md': '0 8px 24px rgba(21, 34, 56, 0.08)',
        'lg': '0 16px 40px rgba(21, 34, 56, 0.10)',
        'xl': '0 24px 60px rgba(21, 34, 56, 0.12)',
        'premium': '0 24px 60px rgba(21, 34, 56, 0.12)',
        'floating': '0 16px 40px -8px rgba(21, 34, 56, 0.16), 0 6px 16px -4px rgba(21, 34, 56, 0.08)',
        'card': '0 4px 16px rgba(21, 34, 56, 0.06)',
        'card-hover': '0 12px 36px rgba(21, 34, 56, 0.12)',
        'primary': '0 8px 24px rgba(11, 155, 110, 0.28)',
        'accent': '0 8px 24px rgba(245, 112, 26, 0.28)',
        '2xs': '0 1px 2px rgba(21, 34, 56, 0.04)',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        '2xl': '36px',
        'canvas': '36px',
        '3xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
      },
    },
  },
  plugins: [],
};
