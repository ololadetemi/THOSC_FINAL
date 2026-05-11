/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — deep navy from the logo and headings
        primary: {
          50:  '#e8edf5',
          100: '#c5d0e6',
          200: '#9fb0d4',
          300: '#7890c2',
          400: '#5c78b5',
          500: '#3f60a8',
          600: '#1B3A6B',  // ← main navy
          700: '#162f57',
          800: '#102443',
          900: '#0a192f'
        },
        // Accent — the bright blue used on "Bones," and stats
        accent: {
          100: '#d0e2fb',
          200: '#a0c5f7',
          300: '#70a8f3',
          400: '#4d92ef',
          500: '#2E6BE6',  // ← main accent blue
          600: '#2457c2',
          700: '#1a449e',
          800: '#10317a',
          900: '#061e56'
        },
        // Background — the very light blue-grey page background
        surface: '#EEF2F8',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body:    ['"Source Sans 3"', 'sans-serif']
      }
    }
  },
  plugins: []
}
