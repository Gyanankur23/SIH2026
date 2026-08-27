/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthy agricultural theme
        earth: {
          50: '#f7f6f3',
          100: '#ebe8e1',
          200: '#d5cfc4',
          300: '#b9b0a3',
          400: '#9a8f82',
          500: '#7d7266',
          600: '#655c52',
          700: '#534943',
          800: '#453d38',
          900: '#3a3330',
        },
        leaf: {
          50: '#f6fdf6',
          100: '#e9fbe9',
          200: '#d4f7d4',
          300: '#b3efb3',
          400: '#8ce48c',
          500: '#6bd56b',
          600: '#52b852',
          700: '#429942',
          800: '#387f38',
          900: '#316b31',
        },
        soil: {
          50: '#faf9f7',
          100: '#f5f2ed',
          200: '#ebe5d8',
          300: '#ddd4bb',
          400: '#cbbf96',
          500: '#b8a876',
          600: '#a39060',
          700: '#8a7850',
          800: '#746543',
          900: '#63573b',
        },
        harvest: {
          50: '#fffdf5',
          100: '#fff9e6',
          200: '#fff2c4',
          300: '#ffe898',
          400: '#ffdb64',
          500: '#ffce40',
          600: '#ecb533',
          700: '#c79328',
          800: '#a67722',
          900: '#8a631e',
        },
        risk: {
          low: '#6bd56b',
          medium: '#ffce40',
          high: '#e85d04',
          critical: '#d00000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
