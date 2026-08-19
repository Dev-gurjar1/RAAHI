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
        raahi: {
          orange: '#F97316',
          amber: '#F59E0B',
          deep: '#EA580C',
          green: '#10B981',
          'green-dark': '#059669',
          bg: '#FFF7F2',
          surface: '#FFFFFF',
          text: '#111827',
          muted: '#64748B',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(15, 23, 42, 0.08)',
        'floating': '0 16px 36px -6px rgba(0, 0, 0, 0.12), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 12px 32px -8px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'canvas': '32px',
        '3xl': '24px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
};
