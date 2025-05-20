/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#acb1f7',
          200: '#828cce',
          300: '#5868a6',
          400: '#2d437d',
          500: '#031f55',
        },
      },
    },
  },
  plugins: [],
}
