/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#0A0F1C",
          900: "#0F172A",
          800: "#1A2438",
          700: "#263248",
        },
        offwhite: "#F7F6F2",
        cream: "#FAF9F6",
        ink: "#070707",
        mist: "#ECEAE4",
        glass: "rgba(255,255,255,0.72)",
        grape: {
          500: "#9B5D7D",
          300: "#D8A8C2",
        },
        skyglass: {
          500: "#6F8EC8",
          300: "#B7C9EE",
        },
        sageglass: {
          500: "#8AAE9A",
          300: "#C7DCCF",
        },
        border: {
          DEFAULT: "#E4E1D9",
        },
        status: {
          complete: "#2F6047",
          "complete-bg": "#EAF3EE",
          attention: "#7A4D00",
          "attention-bg": "#FBF3E2",
          incomplete: "#8F332D",
          "incomplete-bg": "#FBEBEA",
          review: "#28567F",
          "review-bg": "#EAF1F8",
        },
      },
      borderRadius: {
        premium: "2rem",
        "premium-lg": "2.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.06)",
        premium: "0 8px 30px rgba(10,15,28,0.12)",
        editorial: "0 22px 80px rgba(10,15,28,0.10)",
        glow: "0 18px 70px rgba(111,142,200,0.22)",
        "glow-grape": "0 18px 70px rgba(155,93,125,0.24)",
      },
      backgroundImage: {
        "premium-radial": "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.18) 44%, rgba(255,255,255,0) 70%)",
        "soft-grid": "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};