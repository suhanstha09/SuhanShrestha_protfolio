import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crt: {
          amber: '#ff9f43',
          dim: '#cc7722',
          bright: '#ffb366',
          dark: '#0a0a0a',
          bezel: '#1a1612',
          'bezel-light': '#2a2318',
          green: '#33ff33',
          'green-dim': '#22aa22',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        flicker: 'flicker 0.15s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'boot-expand': 'bootExpand 1.5s ease-out forwards',
        'phosphor-pulse': 'phosphorPulse 3s ease-in-out infinite',
        typewriter: 'typewriter 2s steps(40, end)',
        'static-noise': 'staticNoise 0.1s steps(5) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 159, 67, 0.3), inset 0 0 60px rgba(255, 159, 67, 0.05)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 159, 67, 0.5), inset 0 0 80px rgba(255, 159, 67, 0.1)' },
        },
        bootExpand: {
          '0%': { transform: 'scaleY(0.005) scaleX(0.5)', opacity: '1' },
          '30%': { transform: 'scaleY(0.005) scaleX(1)', opacity: '1' },
          '60%': { transform: 'scaleY(0.5) scaleX(1)', opacity: '1' },
          '100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
        },
        phosphorPulse: {
          '0%, 100%': { textShadow: '0 0 4px rgba(255, 159, 67, 0.8), 0 0 11px rgba(255, 159, 67, 0.5)' },
          '50%': { textShadow: '0 0 8px rgba(255, 159, 67, 1), 0 0 20px rgba(255, 159, 67, 0.7)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        staticNoise: {
          '0%': { backgroundPosition: '0 0' },
          '20%': { backgroundPosition: '-50px -30px' },
          '40%': { backgroundPosition: '30px -50px' },
          '60%': { backgroundPosition: '-30px 30px' },
          '80%': { backgroundPosition: '50px 50px' },
          '100%': { backgroundPosition: '0 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
