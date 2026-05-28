import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-manrope)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
}

export default config
