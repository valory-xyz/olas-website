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
        'gradient-radial': 'radial-gradient(#ac93f0 0%, #8bc6ec 100%)',
        'gradient-conic': 'conic-gradient(#ac93f0 0%, #8bc6ec 100%)',
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
          fontWeight: '900',
          fontFamily: ['Manrope', 'sans-serif'],
        }],
        'paragraph': ['32px', {
          letterSpacing: '-2%',
          lineHeight: '1.35',
          fontWeight: '300',
          fontFamily: ['Inter', 'sans-serif'],
        }],
      },
      colors: {
        'primary': '#7200D6',
      },
    },
    fontFamily: {
      'inter': ['Inter', 'sans-serif'],
      'manrope': ['Manrope', 'sans-serif'],
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
