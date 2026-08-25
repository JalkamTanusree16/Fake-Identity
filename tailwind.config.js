/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0F172A",
          navyDark: "#0A192F",
          navyCard: "#1E293B",
          blue: "#1E3A8A",
          blueLight: "#2563EB",
          accent: "#EA580C",
          saffron: "#D97706",
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
          border: "#334155"
        }
      }
    },
  },
  plugins: [],
}
