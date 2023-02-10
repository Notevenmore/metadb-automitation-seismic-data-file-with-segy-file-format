/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#63f48c",
        secondary: "",
        error: "#ff0000",
        warning: "",
        'side_bar': '#F5F8FA',
        link: "#0064d9"
      }
    },
  },
  plugins: [],
}
