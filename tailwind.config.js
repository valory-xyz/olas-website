/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
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
}
