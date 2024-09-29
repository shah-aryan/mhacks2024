/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.{css,scss,less}',
    './index.{js,jsx,ts,tsx}',
    './app.json',
    './app/+layout.{js,jsx,ts,tsx}',
    './app/+page.{js,jsx,ts,tsx}',
    './app/+error.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

