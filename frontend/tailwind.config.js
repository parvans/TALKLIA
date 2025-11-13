import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
      colors: {
        link: {
          DEFAULT: "rgb(0 245 255)",
          hover: "rgb(0 245 255 / 80%)",
        },
      },
      
    },
  },
  plugins: [daisyui],
};