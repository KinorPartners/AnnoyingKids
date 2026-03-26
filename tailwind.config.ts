import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff2d78',
        'neon-green': '#39ff14',
        'neon-blue': '#00f0ff',
        'neon-yellow': '#fff200',
        'dark-bg': '#0a0a0a',
        'dark-surface': '#141414',
        'dark-card': '#1a1a1a',
        'dark-border': '#2a2a2a',
      },
      fontFamily: {
        bungee: ['Bungee', 'cursive'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 1.5s ease-in-out infinite',
        'jump': 'jump 1.4s cubic-bezier(0.33,0,0.66,0) infinite',
      },
      keyframes: {
        jump: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1) scaleX(1)' },
          '10%':       { transform: 'translateY(0) scaleY(0.85) scaleX(1.15)' },
          '30%':       { transform: 'translateY(-40px) scaleY(1.1) scaleX(0.9)' },
          '55%':       { transform: 'translateY(-50px) scaleY(1) scaleX(1)' },
          '75%':       { transform: 'translateY(-10px) scaleY(1) scaleX(1)' },
          '90%':       { transform: 'translateY(0) scaleY(0.9) scaleX(1.1)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 45, 120, 0.5), 0 0 40px rgba(255, 45, 120, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 45, 120, 0.8), 0 0 60px rgba(255, 45, 120, 0.4)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
};
export default config;
