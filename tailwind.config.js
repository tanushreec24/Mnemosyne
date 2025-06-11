/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  safelist: [
    // Neural color utilities for @apply usage
    'bg-neural-blue-100',
    'bg-neural-blue-200',
    'bg-neural-purple-100',
    'text-neural-blue-700',
    'text-neural-purple-500',
    'text-neural-pink-500',
    'border-neural-blue-200',
    'border-neural-blue-300',
    'hover:bg-neural-blue-200',
    'hover:bg-neural-blue-50',
    // Neural gray utilities
    'bg-neural-gray-100',
    'text-neural-gray-700',
    'border-neural-gray-200',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['DM Serif Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // Neural white and grays
        'neural-white': '#fefefe',
        'neural-gray': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Neural blue spectrum (primary)
        'neural-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Neural purple spectrum (secondary)
        'neural-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Neural pink spectrum (accent)
        'neural-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Keep compatibility colors
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neural': '0 4px 6px rgba(59, 130, 246, 0.07), 0 10px 15px rgba(139, 92, 246, 0.05)',
        'neural-glow': '0 0 20px rgba(59, 130, 246, 0.15), 0 8px 32px rgba(139, 92, 246, 0.1)',
      },
    },
  },
  plugins: [],
};