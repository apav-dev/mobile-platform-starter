module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#1564F9",
        "gray-300": "#E1E5E8",
        "gray-400": "#C4CBD0",
        "gray-500": "#686F7D",
        "gray-700": "#374151",
        "gray-900": "#111827",
        error: "#BA031C",
      },
      screens: {
        xs: "375px",
      },
      fontFamily: {
        "lato-regular": "Lato-Regular",
        "lato-bold": "Lato-Bold",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
