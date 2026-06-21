/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Satoshi"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#05060A',
        ice: '#7DD3FC',
        gold: '#F5C77E',
        mist: '#9FB1C7',
      },
      letterSpacing: {
        widest2: '0.32em',
      },
    },
  },
  plugins: [],
};
