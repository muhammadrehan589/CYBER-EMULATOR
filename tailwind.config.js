/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        synthBg: '#0a001a',
        synthViolet: '#2a0845',
        synthMagenta: '#ff007f',
        synthCyan: '#00f0ff',
        synthPurple: '#6b11ff',
        synthDarkViolet: '#15002a',
      },
      boxShadow: {
        'glow-magenta': '0 0 20px rgba(255, 0, 127, 0.6), 0 0 40px rgba(255, 0, 127, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)',
        'glow-purple': '0 0 25px rgba(107, 17, 255, 0.6)',
      }
    },
  },
  plugins: [],
};
