const {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} = require("tailwindcss-scoped-preflight");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "ika-",
  important: ".ika-root",
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A2540",
          "navy-light": "#173B66",
          "navy-dark": "#061A33",
          cyan: "#06B6D4",
          "cyan-dark": "#0891B2",
          accent: "#E63946",
          "accent-dark": "#C8313D",
          "accent-soft": "#FDE8EA",
          ink: "#0F172A",
          muted: "#475569",
          surface: "#F1F5F9",
          "surface-2": "#E2E8F0",
          line: "#E5E7EB",
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
        },
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(".ika-root"),
    }),
  ],
};
