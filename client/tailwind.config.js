/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          darkBg: '#08080a',
          darkCard: '#111115',
          darkCardHover: '#17171d',
          darkBorder: 'rgba(255, 255, 255, 0.08)',
          darkInput: '#18181f',
          lightBg: '#fbfbfd',
          lightCard: '#ffffff',
          lightBorder: 'rgba(0, 0, 0, 0.07)',
          lightInput: '#f5f5f7',
          blue: '#0071e3',
          blueHover: '#0077ed',
          cyan: '#32ade6',
          purple: '#af52de',
          indigo: '#5856d6',
          pink: '#ff2d55',
          emerald: '#34c759',
          amber: '#ff9f0a',
          grayText: '#86868b',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'apple': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'apple-dark': '0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 4px 14px -2px rgba(0, 0, 0, 0.3)',
        'apple-glow': '0 0 40px -10px rgba(0, 113, 227, 0.35)',
        'apple-pill': '0 2px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      borderRadius: {
        'apple-sm': '12px',
        'apple': '18px',
        'apple-lg': '24px',
        'apple-xl': '32px',
      },
      animation: {
        'apple-float': 'appleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        appleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

