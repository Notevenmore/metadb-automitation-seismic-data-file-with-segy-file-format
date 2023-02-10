/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'side_bar': '#F5F8FA',
        'float_dialog': '#C9C9C9',
        'float_section_divider': '#B1C6D3'
      }
    },
  },
  plugins: [],
}
