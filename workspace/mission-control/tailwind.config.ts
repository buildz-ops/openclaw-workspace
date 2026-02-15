import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mission: {
          bg: '#0a0e17',
          'card-bg': 'rgba(15, 23, 42, 0.5)',
          cyan: '#00d9ff',
          green: '#00ff88',
          magenta: '#ff3366',
          yellow: '#ffcc00',
          'text-primary': '#f1f5f9',
          'text-secondary': '#94a3b8',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        widest: '0.15em',
      },
    },
  },
  plugins: [],
};
export default config;
