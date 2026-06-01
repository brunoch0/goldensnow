/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0D1117",
        "base-soft": "#161B22",
        "base-line": "#21262D",
        gold: "#F5C518",
        "gold-deep": "#B8860B",
        "gold-bright": "#FFD700",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #B8860B 0%, #FFD700 100%)",
        "gold-radial":
          "radial-gradient(circle at 50% 0%, rgba(245,197,24,0.15) 0%, rgba(13,17,23,0) 60%)",
      },
      boxShadow: {
        gold: "0 0 40px rgba(245,197,24,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shine: "shine 4s linear infinite",
      },
    },
  },
  plugins: [],
};
