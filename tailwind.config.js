/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',      // your app directory
      './src/components/**/*.{js,ts,jsx,tsx}' // your components folder
    ],
    theme: {
        extend: {
          boxShadow: {
            // a deeper, two-layer retro shadow
            retro: '0 4px 6px rgba(0,0,0,0.3), 0 8px 12px rgba(0,0,0,0.2)',
          },
          transitionTimingFunction: {
            retro: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
          animation: {
            // fade cards in on load
            fadeIn: 'fadeIn 0.5s ease-out forwards',
          },
          keyframes: {
            fadeIn: {
              '0%':   { opacity: 0, transform: 'translateY(8px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          },
          fontFamily: {
            display: ['var(--font-display', 'sans-serif'],
            body:    ['var(--font-body',    'sans-serif'],
          },
          colors: {
            creme: '#f5f1e8',
          },
        },
      },
      plugins: [],
    };