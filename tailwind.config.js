/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#dce6f6',
          200: '#b3c9ea',
          300: '#89abdd',
          400: '#4d7ac4',
          500: '#2a56a3',
          600: '#1c4084',
          700: '#153269',
          800: '#0f2450',
          900: '#0a1a3d',
          950: '#050f26',
          DEFAULT: '#0a1a3d',
        },
        flame: {
          50: '#fff5ec',
          100: '#ffe6cf',
          200: '#ffc999',
          300: '#ffab5e',
          400: '#ff8c33',
          500: '#fa6a00',
          600: '#e05e00',
          700: '#b84c00',
          800: '#933d00',
          900: '#772f00',
          950: '#421900',
          DEFAULT: '#fa6a00',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(10, 26, 61, 0.08), 0 4px 24px -4px rgba(10, 26, 61, 0.06)',
        lift: '0 8px 30px -8px rgba(10, 26, 61, 0.18), 0 2px 8px -2px rgba(10, 26, 61, 0.08)',
        glow: '0 0 0 1px rgba(250, 106, 0, 0.15), 0 8px 30px -8px rgba(250, 106, 0, 0.35)',
        navyGlow: '0 8px 40px -8px rgba(10, 26, 61, 0.45)',
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(circle at top right, rgba(250,106,0,0.18), transparent 55%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
