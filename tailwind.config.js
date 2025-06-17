/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bluish-purple": "var(--bluish-purple)",
        "dark-violet": "var(--dark-violet)",
        "deep-magenta": "var(--deep-magenta)",
        "midnight-purple": "var(--midnight-purple)",
        pink: "var(--pink)",
      },
      fontFamily: {
        body: "var(--body-font-family)",
        "heading-bold": "var(--heading-bold-font-family)",
        "heading-regular": "var(--heading-regular-font-family)",
        "sub-bold": "var(--sub-bold-font-family)",
        "sub-regular": "var(--sub-regular-font-family)",
      },
    },
  },
  plugins: [],
}
