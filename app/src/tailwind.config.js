const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        bodyCover: "url('../media/bgimage.svg')"
      }),
      fontFamily: {
        sans: [
          '"Inter"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ] // Ensure fonts with spaces have " " surrounding it.
      },
      boxShadow: {
        DEFAULT: "rgba(0, 0, 0, 0.15) 0px 15px 24px, rgba(0, 0, 0, 0.15) 0px 28px 44px"
      },
      colors: {
        sky: colors.sky,
        orange: colors.orange,
        blue: colors.blue,
        macosLight: {
          100: "#fafafa",
          200: "#f5f5f7",
          300: "#f0f0f0"
        },
        macosDark: {
          100: "#2e2e2e",
          200: "#1d1d1f",
          300: "#141414"
        },
        macosAccent: {
          100: "#cce4ff",
          200: "#99caff",
          300: "#66afff",
          400: "#3395ff",
          500: "#0A84FF",
          600: "#007aff",
          700: "#0062cc",
          800: "#004999",
          900: "#003166",
          1000: "#001833"
        },
        wvsc: {
          100: "#202531",
          200: "#1a1e27",
          300: "#13161d",
          400: "#0d0f14"
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
