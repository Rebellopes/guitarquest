/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        "primary-dark": "#5A52D5",
        secondary: "#FF6584",
        accent: "#FFD166",
        success: "#06D6A0",
        warning: "#FFD166",
        danger: "#EF476F",
        surface: "#1E1E2E",
        background: "#13131F",
        "surface-light": "#2A2A3D",
      },
      fontFamily: {
        heading: ["Nunito-Bold", "sans-serif"],
        body: ["Nunito-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
