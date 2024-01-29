/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'waves': "url('/images/waves-tile.png')",
        'dark-hexagons1': "url('/images/dark-hexagons1.png')",
        'dark-hexagons2': "url('/images/dark-hexagons2.png')",
        'dark-hexagons3': "url('/images/dark-hexagons3.png')",
        'governatooorr': "url('/images/governatooorr-tiled.png')",
        'subtle-gradient': "radial-gradient(at 100% 40%, rgba(125, 211, 252, 30%) 0, transparent 25%), radial-gradient(at right bottom, rgb(245, 208, 254), rgb(255, 255, 255, 100%), rgb(255, 255, 255, 100%), rgba(168, 85, 247, 50%))"
      },
      backgroundSize: {
        'size-25': '25%',
        'size-50': '50%',
        'size-100': '100%',
      },
      backgroundRepeat: {
        'no-repeat': 'no-repeat',
        'repeat': 'repeat',
      },
      fontSize: {
        'heading': ['64px', {
          letterSpacing: '-4%',
          lineHeight: '1.15',
          fontWeight: '900'
        }],
        'paragraph': ['32px', {
          letterSpacing: '-2%',
          lineHeight: '1.35',
          color: '#000000',
          fontWeight: '300'
        }],
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Manrope', 'sans-serif'],
      },
      colors: {
        'primary': '#7200D6',
      },
    },
    fontFamily: {
      'inter': ['Inter', 'sans-serif'],
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.background-clip': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
        }
      }
      addUtilities(newUtilities)
    }

  ],
};