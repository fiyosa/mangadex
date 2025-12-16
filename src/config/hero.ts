import { heroui } from '@heroui/react'

export default heroui({
  themes: {
    light: {
      extend: 'light',
      colors: {
        background: '#E8E6E3', // Warm cream, tidak terlalu terang
        foreground: '#1A1A2E', // Soft dark, tidak pure black
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          DEFAULT: '#8B5CF6',
          foreground: '#ffffff',
        },
        content1: '#F5F3F0', // Warm off-white
        content2: '#E8E6E3', // Cream
        content3: '#D8D6D3', // Warm gray
        content4: '#C8C6C3', // Darker warm gray
        divider: '#D8D6D3',
        focus: '#6366F1',
      },
      layout: {
        disabledOpacity: '0.4',
        radius: {
          small: '6px',
          medium: '10px',
          large: '14px',
        },
        borderWidth: {
          small: '1px',
          medium: '1.5px',
          large: '2px',
        },
      },
    },
    dark: {
      extend: 'dark',
      colors: {
        background: '#0F0F1A', // Soft dark blue, tidak pure black
        foreground: '#EAEAEA', // Soft white, tidak pure white
        primary: {
          50: '#1E1B4B',
          100: '#312E81',
          200: '#3730A3',
          300: '#4338CA',
          400: '#4F46E5',
          500: '#6366F1',
          600: '#818CF8',
          700: '#A5B4FC',
          800: '#C7D2FE',
          900: '#E0E7FF',
          DEFAULT: '#818CF8',
          foreground: '#0F0F1A',
        },
        secondary: {
          50: '#2E1065',
          100: '#4C1D95',
          200: '#5B21B6',
          300: '#6D28D9',
          400: '#7C3AED',
          500: '#8B5CF6',
          600: '#A78BFA',
          700: '#C4B5FD',
          800: '#DDD6FE',
          900: '#EDE9FE',
          DEFAULT: '#A78BFA',
          foreground: '#0F0F1A',
        },
        content1: '#18181B',
        content2: '#1F1F23',
        content3: '#27272A',
        content4: '#3F3F46',
        divider: '#27272A',
        focus: '#818CF8',
      },
      layout: {
        disabledOpacity: '0.3',
        radius: {
          small: '6px',
          medium: '10px',
          large: '14px',
        },
        borderWidth: {
          small: '1px',
          medium: '1.5px',
          large: '2px',
        },
      },
    },
    'purple-dark': {
      extend: 'dark',
      colors: {
        background: '#0D001A',
        foreground: '#ffffff',
        primary: {
          50: '#3B096C',
          100: '#520F83',
          200: '#7318A2',
          300: '#9823C2',
          400: '#c031e2',
          500: '#DD62ED',
          600: '#F182F6',
          700: '#FCADF9',
          800: '#FDD5F9',
          900: '#FEECFE',
          DEFAULT: '#DD62ED',
          foreground: '#ffffff',
        },
        focus: '#F182F6',
      },
      layout: {
        disabledOpacity: '0.3',
        radius: {
          small: '4px',
          medium: '6px',
          large: '8px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
    },
  },
})
