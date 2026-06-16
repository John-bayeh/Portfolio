/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        gold: "#C9A84C",
        muted: "#555555",
        card: "#111111",
        line: "#222222",
      },
      fontFamily: {
        display: ['"Clash Display"', "sans-serif"],
        sans: ['"Inter"', "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
}
