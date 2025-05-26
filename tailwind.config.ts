// tailwind.config.ts
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
        'ios-blue': '#007AFF', // Standard iOS blue
        'ios-light-gray': '#F2F2F7', // Light mode background
        'ios-mid-gray': '#E5E5EA',   // Separators, borders
        'ios-dark-gray': '#8E8E93',  // Secondary text
        'ios-almost-black': '#1C1C1E', // Primary text (dark mode)
        'ios-red': '#FF3B30',
        'ios-green': '#34C759',
        // You can add more iOS specific colors as needed
      },
      fontFamily: {
        // iOS uses San Francisco (SF Pro Text, SF Pro Display).
        // Fallback to system UI fonts.
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      borderRadius: {
        'ios': '0.5rem', // Common iOS corner radius (approx 8-10px)
      },
    },
  },
  plugins: [],
};
export default config;
