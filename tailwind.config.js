/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,ts,jsx,tsx}" ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#5041FF',
        },
        gray: {
          500: '#6B7280',
          200: '#E5E7EB',
        },
        neutral: {
          100: '#F3F4F6',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

