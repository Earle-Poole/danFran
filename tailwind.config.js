module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        26: '6.5rem',
        220: '55rem',
      },
      keyframes: {
        'fast-flip': {
          from: {
            transform: 'rotateY(0deg) rotateZ(0deg)',
          },
          to: {
            transform: 'rotateY(720deg) rotateZ(360deg)',
          },
        },
      },
      animation: {
        'fast-flip': 'fast-flip 1s',
      },
    },
  },
  plugins: [],
}
