/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#63f48c',
        secondary: '',
        error: '#ff0000',
        warning: '',
        side_bar: '#F5F8FA',
        link: '#0064d9',
        float_dialog: '#C9C9C9',
        float_section_divider: '#B1C6D3',
        searchbg: '#d5e1f0',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '1500px',
          },
        },
      },
      spacing: {
        '18p': '18px',
        '60p': '60px',
        '170p': '170px',
        '250p': '250px',
        '60pc': "60%",
        '85pc': "85%",
        '90pc': "90%",
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
