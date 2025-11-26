/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f9fb",
          500: "#0ea5a4",
          700: "#0b7f79"
        }
      }
    }
  },
  plugins: []
};