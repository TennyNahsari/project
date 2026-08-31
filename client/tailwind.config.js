/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        brand: ['Playfair Display', 'serif'],
      },
      colors: {
        'soft-mist': '#F7F6F2',
        'pure-white': '#FFFFFF',
        'deep-indigo': '#2D2A4E',
        'soft-coral': '#E88B7A',
        'muted-sage': '#7A9B8C',
        'dark-slate': '#1E1E2A',
        'soft-stone': '#6B6B7A',
        'muted-grey': '#A0A0B0',
        'light-grey': '#E8E6E0',
        'muted-emerald': '#4A9E7A',
        'soft-amber': '#E8B84B',
        'muted-rose': '#D97A6B',
        'soft-sky': '#6C9BCF',
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0, 0, 0, 0.06)",
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        modal: "0 10px 25px -5px rgba(45, 42, 78, 0.15), 0 8px 10px -6px rgba(45, 42, 78, 0.1)"
      }
    }
  },
  plugins: []
};
