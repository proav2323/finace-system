/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  darkMode: "class",
  content: ["./src/**/*.{html,ts}", "./src/lib/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
