/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0e14',
        emerald: '#00e5a0',
        coral: '#ff5c38',
        paper: '#f2f5f8',
        slateSoft: '#8b97a8',
      },
      fontFamily: {
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 48px rgba(0, 229, 160, 0.22)',
        coral: '0 0 48px rgba(255, 92, 56, 0.18)',
      },
      backgroundImage: {
        'noise': "url('/noise.svg')",
        'radial-stage': 'radial-gradient(circle at 50% 20%, rgba(0,229,160,.22), transparent 35%), radial-gradient(circle at 82% 28%, rgba(255,92,56,.12), transparent 28%), linear-gradient(180deg, rgba(10,14,20,1), rgba(6,9,13,1))',
      },
    },
  },
  plugins: [],
};
