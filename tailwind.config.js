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
        'hero': 'url("/images/hero-bg.png")',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        'heading': ['64px', {
          letterSpacing: '-4%',
          lineHeight: '1.15',
          fontWeight: '700',
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
    },
  },
  plugins: [],
};
