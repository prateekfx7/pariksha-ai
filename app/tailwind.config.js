/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    preflight: false, // Important to prevent breaking existing Vanilla CSS layout
  },
  theme: {
    extend: {
      colors: {
        primary: "#f05a28",
        'primary-light': "#ff7a4d",
        'primary-dark': "#d44a1e",
        secondary: "#241c17",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.04)' },
        },
        headlineLoop: {
          '0%': {
            backgroundPosition: '0% center',
            filter: 'drop-shadow(0 0 15px rgba(240, 90, 40, 0.3))',
          },
          '50%': {
            backgroundPosition: '-100% center',
            filter: 'drop-shadow(0 0 35px rgba(255, 122, 77, 0.75))',
          },
          '100%': {
            backgroundPosition: '-200% center',
            filter: 'drop-shadow(0 0 15px rgba(240, 90, 40, 0.3))',
          },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
        'headline-loop': 'headlineLoop 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
