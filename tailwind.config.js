/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#1f2937",
        textColor: "#ffffff",
        inputBg: "#374151",
        borderColor: "#4b5563",
        buttonBg: "#10b981",
        buttonHover: "#059669",
        noteHover: "#4b5563",
        noteBackground: "#2f3641be",
        scrollbarBg: "#374151",
        scrollbarThumb: "#4b5563",
        scrollbarThumbHover: "#6b7280",
      },
      opacity: {
        completed: "0.2",
      },
    },
  },
  plugins: [],
};
