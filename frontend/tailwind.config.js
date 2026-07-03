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
        border: {
          DEFAULT: "#E4E1D9",
        },
        status: {
          complete: "#3B7356",
          "complete-bg": "#EAF3EE",
          attention: "#B2790A",
          "attention-bg": "#FBF3E2",
          incomplete: "#B3433A",
          "incomplete-bg": "#FBEBEA",
          review: "#3B6EA5",
          "review-bg": "#EAF1F8",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.06)",
        premium: "0 8px 30px rgba(10,15,28,0.12)",
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
