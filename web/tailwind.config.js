module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        clearrun: {
          900: '#0B3A66',
          700: '#174B7A',
          500: '#2F855A',
          amber: '#D69E2E',
          danger: '#C53030'
        }
      }
    }
  },
  plugins: []
}
