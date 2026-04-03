/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: {
            primary: '#0d1117',
            secondary: '#161b22',
            tertiary: '#21262d',
          },
          border: {
            default: '#30363d',
            muted: '#21262d',
          },
          text: {
            primary: '#e6edf3',
            secondary: '#7d8590',
            muted: '#484f58',
          },
          accent: {
            blue: '#58a6ff',
            green: '#3fb950',
            red: '#f85149',
            orange: '#d29922',
            purple: '#a371f7',
          },
          button: {
            primary: '#238636',
            primaryHover: '#2ea043',
            default: '#21262d',
          },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
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