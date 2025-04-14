/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: '0 0 5px rgba(255, 255, 255, 0.4)',
      },
    },
    keyframes: {
      bounceTool: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-4px)' },
      },
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
    },
    animation: {
      bounceTool: 'bounceTool 0.3s ease',
      wiggle: 'wiggle 0.3s ease',
    },
    
  },
  plugins: [],
}

