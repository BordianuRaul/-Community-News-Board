/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

