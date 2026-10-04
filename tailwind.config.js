/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B00",
          "orange-dark": "#E05A00",
          blue: "#1E58C8",
          "blue-dark": "#1642A0",
          navy: "#0B192C",
          gold: "#FACC15",
          "gold-dark": "#D97706"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Ethiopic"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Noto Sans Ethiopic"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
