/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "540px",
      // => @media (min-width: 540px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1800px",
      // => @media (min-width: 1536px) { ... }
    },

    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        sidebar: "#263238",
        icons: "#78889B",
        "card-borders": "#D7D7D7",
        "bg-color": "#F0F0F0",
        active: "#FFCF00",
        "text-active": "#374C2B",
        buttons: "#356966",
        header: "#B2B8BE",
        error: "#E5484D",
      },
    },
  },
  plugins: [],
};
