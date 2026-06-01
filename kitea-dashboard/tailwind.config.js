/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding custom brand colors for KITEA dashboards
        kiteaBlue: '#0056b3',
        kiteaRed: '#d9534f',
      }
    },
  },
  plugins: [],
}