module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      fontSize: {
        14: "14px",
      },
      backgroundColor: {
        "main-bg": "#FAFBFB",
        "main-dark-bg": "#20232A",
        "secondary-dark-bg": "#33373E",
        "light-gray": "#F7F7F7",
        "half-transparent": "rgba(0, 0, 0, 0.5)",
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      width: {
        400: "400px",
        760: "760px",
        780: "780px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        80: "80px",
      },
      minHeight: {
        590: "590px",
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://img.freepik.com/free-vector/white-gold-geometric-pattern-background-vector_53876-140726.jpg?w=996&t=st=1665505669~exp=1665506269~hmac=10721be78c5066bea565dbb37723b4390202fb15d1965be6a45537ff9ba80de2')",
      },
      keyframes: {
        toastAnimation: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "50%": { opacity: 1 },
          "100%": { transform: "translateX(0px)" },
        },
      },
      animation: {
        toastIn: "toastAnimation 1s",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
}
