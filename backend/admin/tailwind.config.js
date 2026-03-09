/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4E4C1',
          dark: '#B8960C',
        },
        sidebar: '#111827',
      },
    },
  },
  plugins: [],
};
