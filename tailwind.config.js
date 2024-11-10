/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'parchment': {
          DEFAULT: '#f4e4bc',
          dark: '#e4d4ac',
        },
        'brown': {
          100: '#f5e6d3',
          200: '#e6d5b8',
          300: '#d4b795',
          400: '#c19072',
          500: '#a66e4e',
          600: '#8b4513',
          700: '#723a0f',
          800: '#5a2e0c',
          900: '#422109',
        }
      },
      fontFamily: {
        'medieval': ['MedievalSharp', 'serif'],
      },
      backgroundImage: {
        'parchment-pattern': "url('/images/parchment-bg.png')",
        'header-pattern': "url('/images/header-bg.png')",
        'scroll-pattern': "url('/images/scroll-bg.png')",
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'medieval': '0 2px 4px rgba(66, 33, 9, 0.2)',
        'medieval-lg': '0 4px 8px rgba(66, 33, 9, 0.3)',
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addComponents }) {
      addComponents({
        '.medieval-input': {
          '@apply bg-white/80 border-2 border-brown-600 rounded-md px-3 py-2 font-medieval': {},
          '&:focus': {
            '@apply outline-none border-brown-800 ring-2 ring-brown-500/50': {},
          },
        },
        '.medieval-button': {
          '@apply bg-brown-600 text-parchment font-medieval px-4 py-2 rounded-md shadow-medieval': {},
          '@apply hover:bg-brown-700 transition-all duration-200': {},
          '@apply active:transform active:scale-95': {},
        },
        '.medieval-card': {
          '@apply bg-parchment border-2 border-brown-800 rounded-lg shadow-medieval-lg': {},
          '@apply overflow-hidden': {},
        },
        '.medieval-table-header': {
          '@apply bg-brown-800 text-parchment font-medieval p-2': {},
        },
      })
    }
  ],
}
