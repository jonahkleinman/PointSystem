/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        '5/12': '41.666667%',
      }
    },
    fontFamily: {
      redhat: ["Red Hat Display", "sans-serif"],
    },
  },
  plugins: [],
};
