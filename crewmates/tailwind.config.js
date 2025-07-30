/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors for the space theme
        "space-dark": "#1a1625",
        "space-purple": "#2d1b69",
        "space-blue": "#0f3460",
        "crewmate-red": "#c51111",
        "crewmate-blue": "#1919c7",
        "crewmate-green": "#00b04f",
        "crewmate-pink": "#ee54bb",
        "crewmate-orange": "#f07c1d",
        "crewmate-yellow": "#f5f557",
        "crewmate-black": "#3f474e",
        "crewmate-white": "#d6e0f0",
        "crewmate-purple": "#6b2fbb",
        "crewmate-brown": "#71491e",
        "crewmate-cyan": "#50ef39",
        "crewmate-lime": "#50ef39",
      },
      fontFamily: {
        space: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
};
