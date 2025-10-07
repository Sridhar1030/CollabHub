/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'modal-appear': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(88, 166, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(88, 166, 255, 0.5)' }
        }
      },
      animation: {
        'modal': 'modal-appear 0.2s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}