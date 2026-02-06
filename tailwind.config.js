/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        breathe: {
          50: '#F0F9FF',
          100: '#E0F2FE', // Light/Airy
          glass: 'rgba(255, 255, 255, 0.2)',
          primary: '#1E293B', // Slate 800 - Deep text
          secondary: '#64748B', // Slate 500 - Muted text
          slider: {
             start: '#E4E4E7', // Zinc 200 - Numb
             end: '#FCD34D',   // Amber 300 - Vibrant
          }
        },
        cozy: {
          warm: '#1C1917', // Stone 900
          clay: '#292524', // Stone 800
          sand: '#A8A29E', // Stone 400
          amber: '#F59E0B',
          soft: '#44403C', // Stone 700
        }
      },
      fontFamily: {
        serif: ['Serif'], // We will load a font and call it 'Serif'
        sans: ['Sans'],   // We will load a font and call it 'Sans'
      }
    },
  },
  plugins: [],
}