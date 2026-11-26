/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px) rotate(-1deg)' },
          '40%': { transform: 'translateX(8px) rotate(1deg)' },
          '60%': { transform: 'translateX(-6px) rotate(-0.5deg)' },
          '80%': { transform: 'translateX(6px) rotate(0.5deg)' },
        },
        flipIn: {
          '0%': { transform: 'rotateX(70deg) scale(0.96)', opacity: '0.35' },
          '100%': { transform: 'rotateX(0deg) scale(1)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '70%': { transform: 'scale(1.03)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shake: 'shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        flipIn: 'flipIn 0.26s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        popIn: 'popIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};
