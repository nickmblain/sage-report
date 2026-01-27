/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#e8f4f5',
          100: '#c4e4e6',
          200: '#9cd4d7',
          300: '#74c4c8',
          400: '#3fa0a6',
          500: '#177d83',
          600: '#136a6f',
          700: '#0f575b',
          800: '#0b4447',
          900: '#073335',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf8f0',
          200: '#f5f2e6',
        },
        charcoal: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#4a4a4a',
          800: '#2f2f2f',
          900: '#1f1f1f',
        },
        tan: {
          light: '#efe0c0',
          lighter: '#f7f0e0',
          dark: '#d1b580',
        },
        purple: {
          DEFAULT: '#bab2ff',
          hover: '#a599ee',
        },
        green: {
          lighter: '#e6f2e7',
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
