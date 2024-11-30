/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./static/js/**/*.{js,jsx}",
    "./templates/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
