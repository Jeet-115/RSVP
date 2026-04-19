/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ink: {
          950: '#070A12',
          900: '#0B1220',
          800: '#0F1B33',
        },
        brand: {
          50: '#EEF7FF',
          100: '#D9EEFF',
          200: '#B5DEFF',
          300: '#7CC6FF',
          400: '#3AA7FF',
          500: '#0A84FF',
          600: '#0069E0',
          700: '#0054B3',
          800: '#0B3F7F',
          900: '#0C2F58',
        },
        accentPurple: '#B794F4',
        accentTeal: '#4FD1C5',
      }
    }
  },
  plugins: []
};
